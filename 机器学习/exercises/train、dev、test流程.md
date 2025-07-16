
## 读取数据集

```python
from torch.utils.data import Dataset, DataLoader

class COVID19Dataset(Dataset):

    def __init__(self,
                 path,
                 mode='train',
                 target_only=False):
        self.mode = mode
        with open(path, 'r') as fp:
            data = list(csv.reader(fp))
            data = np.array(data[1:])[:, 1:].astype(float)
        if not target_only:
			# 这里给的数据一共 94 列，前 93 列为参数，最后一列是待拟合值
            feats = list(range(93))
        else:
            feats = list(range(40)) + [57,75]
        if mode == 'test':
            data = data[:, feats]
            self.data = torch.FloatTensor(data)
        else:
            target = data[:, -1]
            data = data[:, feats]
            if mode == 'train':
                indices = [i for i in range(len(data)) if i % 10 != 0]
            elif mode == 'dev':
                indices = [i for i in range(len(data)) if i % 10 == 0]
            self.data = torch.FloatTensor(data[indices])
            self.target = torch.FloatTensor(target[indices])
		# 前四十个是 one-hot vector 表示地理位置，后面是一些指标，归成标准正态分布
        self.data[:, 40:] = \
            (self.data[:, 40:] - self.data[:, 40:].mean(dim=0, keepdim=True)) \
            / self.data[:, 40:].std(dim=0, keepdim=True)

        self.dim = self.data.shape[1]

    def __getitem__(self, index):
        if self.mode in ['train', 'dev']:
            return self.data[index], self.target[index]
        else:
            return self.data[index]

    def __len__(self):
        return len(self.data)


def prep_dataloader(path, mode, batch_size, n_jobs=0, target_only=False):
    dataset = COVID19Dataset(path, mode=mode, target_only=target_only)  
    dataloader = DataLoader(
        dataset, batch_size,
        shuffle=(mode == 'train'), drop_last=False,
        num_workers=n_jobs, pin_memory=True)                          
    return dataloader

```

## 构建网络

```python
class NeuralNet(nn.Module):

    def __init__(self, input_dim):

        super(NeuralNet, self).__init__()

        self.net = nn.Sequential(

            nn.Linear(input_dim, 64),

            nn.ReLU(),

            nn.Linear(64, 1)

        )


        self.criterion = nn.MSELoss(reduction='mean')

  
    def forward(self, x):

        return self.net(x).squeeze(1)

  
    def cal_loss(self, pred, target,l1_lambda=1e-5,l2_lambda=1e-5):

        mse_loss = self.criterion(pred,target)

        l1_loss = 0.

        l2_loss = 0.

        for param in self.parameters():

            l1_loss += param.abs().sum()

            l2_loss += (param ** 2).sum()

        loss = mse_loss + l1_lambda * l1_loss + l2_lambda * l2_loss

        return loss
```

## train 和 dev

dev 负责把整个 epoch 里面的 dev 数据全都跑一次求算术平均 loss 

```python
def dev(dv_set, model, device):
    model.eval()                              
    total_loss = 0
    for x, y in dv_set:                        
        x, y = x.to(device), y.to(device)      
        with torch.no_grad():                
            pred = model(x)                    
            mse_loss = model.cal_loss(pred, y,0.,0.)
        total_loss += mse_loss.detach().cpu().item() * len(x)
    total_loss = total_loss / len(dv_set.dataset)
    return total_loss
```

train 训练模型，如果很长时间没减 loss 那么就停止
```python
def train(tr_set, dv_set, model, config, device):
    n_epochs = config['n_epochs']  

    optimizer = getattr(torch.optim, config['optimizer'])(
        model.parameters(), **config['optim_hparas'])

    min_mse = 1000.
    loss_record = {'train': [], 'dev': []}    
    early_stop_cnt = 0
    epoch = 0
    while epoch < n_epochs:
        model.train()                         
        for x, y in tr_set:                  
            optimizer.zero_grad()              
            x, y = x.to(device), y.to(device)  
            pred = model(x)                  
            mse_loss = model.cal_loss(pred, y)  
            mse_loss.backward()                
            optimizer.step()                    
            loss_record['train'].append(mse_loss.detach().cpu().item())
        dev_mse = dev(dv_set, model, device)
        if dev_mse < min_mse:
            min_mse = dev_mse
            print('Saving model (epoch = {:4d}, loss = {:.4f})'
                .format(epoch + 1, min_mse))
            torch.save(model.state_dict(), config['save_path'])  
            early_stop_cnt = 0
        else:
            early_stop_cnt += 1
        epoch += 1
        loss_record['dev'].append(dev_mse)
        if early_stop_cnt > config['early_stop']:
            break
    print('Finished training after {} epochs'.format(epoch))
    return min_mse, loss_record
```