# Mui组件

### mui的Paper

如同纸张一样的组件

- elevation={0}去掉阴影，数字越大阴影就越深



### mui弹窗Dialog

`Dialog`标签会出现在和`id=root`的`div`同一级，大小铺满整个屏幕。自动创建一个paper来装载内容，这个paper自动处于屏幕中央，可以用`PaperProps`来修改这个paper的样式，其中`maxWeight:none`可以去掉最大宽度限制。这个paper默认为`relative、flex-column`。

下面是一个演示组件

![14](D:\note\前端\实习\src\14.png)



```tsx
import { Button, Dialog, IconButton, Typography, styled } from '@mui/material'
import { Close } from '@src/assets/icons/Close'
import { usePromptStore } from '@src/stores/promptStore'
import { t } from 'i18next'
import React from 'react'
type NoCreditWarningProps = {
  style?: React.CSSProperties
}

const ActionButton = styled(Button)({
  textTransform: 'none',
  fontSize: 16,
  fontWeight: 700,
  lineHeight: '24px',
  borderRadius: '8px',
  padding: '8px 12px',
  boxShadow: 'none',
})

const NoCreditWarning: React.FC<NoCreditWarningProps> = ({ style }) => {
  const { noCreditWarningOpen, setNoCreditWarningOpen, setRedemptionOpen } = usePromptStore()
  return (
    <Dialog
      open={noCreditWarningOpen}
      PaperProps={{
        style: {
          width: 360,
          padding: '32px 40px 20px',
          position: 'relative',
        },
      }}
    >
      <IconButton
        sx={{
          position: 'absolute',
          right: 8,
          padding: 0,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
        onClick={() => setNoCreditWarningOpen(false)}
      >
        <Close />
      </IconButton>
      <Typography
        style={{
          fontSize: '16px',
          lineHeight: '24px',
          fontWeight: '700',
          marginBottom: 32,
        }}
      >
        {t('prompt:no_credit')}
      </Typography>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <ActionButton
          variant="contained"
          style={{
            backgroundColor: '#ebebeb',
            color: '#5c5c5c',
            width: '32%',
          }}
          onClick={() => setNoCreditWarningOpen(false)}
        >
          {t('common:cancel')}
        </ActionButton>
        <ActionButton
          variant="contained"
          style={{
            backgroundColor: '#00ae42',
            color: 'white',
            width: '60%',
          }}
          onClick={() => {
            setNoCreditWarningOpen(false)
            setRedemptionOpen(true)
          }}
        >
          {t('prompt:redemption')}
        </ActionButton>
      </div>
    </Dialog>
  )
}

export default NoCreditWarning

```



### mui文本输入框TextField

- fullWidth让其占满宽度
- multiline表示输入框是多行的
- variant选择样式
- color选择选中时的下划线颜色
- rows设置总行数
- error依赖的值为true时border为红色
- inputProps设置文字的样式
- 去掉下划线

```tsx
        sx={{
          '& .MuiInput-underline:before': { borderBottom: 'none' },
          '& .MuiInput-underline:after': { borderBottom: 'none' },
          '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
        }}
```

- 去掉滑动栏

```tsx
        inputProps={{
          style: {
            overflow: 'scroll',
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none',
          },
        }}
```



示例：

```tsx
      <TextField
        fullWidth
        multiline
        variant="standard"
        color="success"
        rows={10}
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        inputProps={{
          style: {
            fontSize: "16px",
            lineHeight: "24px",
            letterSpacing: "0.1em",
          },
        }}
      />
```





### mui选择框Checkbox

![12](D:\note\前端\实习\src\12.png)

`color="success"`可以在选中时表现为绿色

`size="small"`选择小尺寸

`checked={...}`选择控制按钮是否表现为选中状态的变量

`onChange={...}`处理选中、不选中变化的函数

### mui按钮Button

用`variant="contained"`控件按钮的样式

用`color`控制点击时变化的颜色

`style`里面的`color`控制文字的颜色

`style`里面设置`textTransform: 'none'`确保不影响文字的大小写

`CircularProgress`可以为`Button`加上loading的效果

```tsx
startIcon={confirmLoading ? <CircularProgress size={20} color="inherit" /> : null}
```

![18](D:\note\前端\实习\src\18.png)

### mui菜单栏

#### styled

基于特定的标签做多态，外层的样式是`StepButton`本身的样式，`&.Mui-selected`表示被选中时的样式，`& > span`表示组件下的直接子`span`元素的样式

```tsx
const StepButton = styled(ToggleButton)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '64px',
  height: '100px',
  gap: '5px',
  backgroundColor: '#F7F7F7',
  '&.Mui-selected': {
    backgroundColor: '#ffffff',
  },
  '& > span': {
    textTransform: 'none', 
  },
}))
```



#### ToggleButtonGroup

`exclusive`表示只能有一个按钮被选中，`value`是选择不同的按钮所代表的变量，每次选择按钮就会触发`onChange`

```tsx
  const onStepChange = (event: React.MouseEvent<HTMLElement> | null, value: EditorStep) => {
    if (value !== null && value !== undefined ) setStep(value) //防止点击同一个按钮导致bug
  }

<ToggleButtonGroup orientation="vertical" exclusive value={step} onChange={onStepChange}>
        <StepButton value={EditorStep.EYES} key="one">
          <StepEyes /> //这是一个Icon
          <span>Eyes</span>
        </StepButton>
        <StepButton value={EditorStep.COLOR} key="two">
          <StepColor /> //这是一个Icon
          <span>Color</span>
        </StepButton>
        <StepButton value={EditorStep.BASE} key="three">
          <StepBase /> //这是一个Icon
          <span>Base</span>
        </StepButton>
</ToggleButtonGroup>
```



### mui实现跟随式浮框

#### Popover

只要`addAnchorEl`改变，`addPopoveOpen`就会自动跟着改变

```tsx
  const [addAnchorEl, setAddAnchorEl] = useState<SVGSVGElement | null>(null)
  const addPopoverOpen = Boolean(addAnchorEl)
```

利用`ref`设置跟随标签

```tsx
<AddColor
    ref={addBtnRef}
    onClick={() => setAddAnchorEl(addBtnRef.current)}
/>
```

`anchorEl`控制跟随对象，`anchorOrigin`控制跟随方式
`onClose`在点击`Popover`外面的区域时会被触发

```tsx
<Popover
  open={addPopoverOpen}
  anchorEl={addAnchorEl}
  onClose={() => setAddAnchorEl(null)}
  anchorOrigin={{
  vertical: 'bottom',
  horizontal: 'left',
  }}
>
 ...
</Popover>
```



#### Tooltip

悬浮文字，注意用可以接收鼠标事件的原生span包裹

```tsx
          <Tooltip
            title={t('model_edit_tool_panel:relief_params:vertical_tooltip')}
            arrow
            disableInteractive
            componentsProps={{
              tooltip: {
                sx: {
                  padding: ' 8px',
                  bgcolor: '#333333',
                  color: '#f2f2f2',
                  fontSize: '12px',
                  '& .MuiTooltip-arrow': {
                    color: '#333333',
                  },
                },
              },
            }}
          >
            <span>
              <HelpIcon />
            </span>
          </Tooltip>
```





### mui做Alert

配合Snackbar一起使用，可以设置持续出现的时间，Snackbar的position默认是fixed

```tsx
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1500}
        style={{
          top: 12,
        }}
        onClose={() => {
          setSnackbarOpen(false)
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Alert
          severity="error"
          sx={{ width: '100%', fontSize: '15px' }}
          variant="filled"
          onClose={() => setSnackbarOpen(false)}
        >
          {t('common:credits_error')}
        </Alert>
      </Snackbar>
```



### mui可折叠卡片

![19](D:\note\前端\实习\src\19.png)

![20](D:\note\前端\实习\src\20.png)

`Accordion`结构

```tsx
    <Accordion>
      <AccordionSummary>
        ...展开前的内容
      </AccordionSummary>
      <AccordionDetails>
          ...展开后多出来的内容
      </AccordionDetails>
    </Accordion>
```

实例

```tsx
    <Accordion
      sx={{
        //before和shadow去掉上下的两条线
        '&:before': {
          display: 'none',
        },
        boxShadow: 'none',
        backgroundColor: '#f2f2f2',
        borderRadius: '8px',
        //为了让ICON的absolute放对位置
        position: 'relative',
      }}
    >
      <AccordionSummary
        expandIcon={<DropdownArrowIcon />}
        sx={{
          fontSize: 12,
          lineHeight: '18px',
          fontFamily: 'Open Sans',
          //设置子标签中.MuiAccordionSummary-content.Mui-expanded的样式
          '& .MuiAccordionSummary-content.Mui-expanded': {
            margin: 0,
          },
        }}
      >
        {summary}
      </AccordionSummary>
      <AccordionDetails sx={{ paddingTop: 0 }}>{details}</AccordionDetails>
    </Accordion>
```

子元素`summary`

```tsx
 //AccordionSummary默认是flex，这里的title是一个Trans，里面用了<strong>标签，会把一段话分为一个strong标签和一段字符串，如果不用div包裹整个title就会导致它被flex隔开
	<div>
      {icon && <div style={{ position: 'absolute', left: 0, top: 0 }}>{icon}</div>}
      {title}
    </div>
```

子元素`details`

```tsx
export const AccordionContent: React.FC<AccordionContentProps> = ({
  tutorialUrl,
  purchaseUrl,
  cardImgUrl,
  cardTitle,
  cardDesc,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 购买链接 */}
      <a
        href={tutorialUrl}
        style={{
          color: '#00AE42',
          textDecoration: 'none',
          marginBottom: 12,
          fontSize: '12px',
          lineHeight: '18px',
        }}
      >
        {t('base:tips_tutorial')}
      </a>
      {/* 教程卡片 */}

      <Card
        sx={{ display: 'flex', borderRadius: '10px' }}
        onClick={() => {
          window.open(purchaseUrl, '_blank')
        }}
      >
        <CardMedia
          component="img"
          sx={{ width: 70, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}
          image={cardImgUrl}
          alt=""
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography fontSize={12} lineHeight={'18px'} fontWeight={600}>
              {cardTitle}
            </Typography>
            <Typography fontSize={10} lineHeight={'18px'}>
              {cardDesc}
            </Typography>
          </CardContent>
        </Box>
      </Card>
    </div>
  )
}
```



