import classnames from 'classnames';
import { CheckCircleFilled } from '@ant-design/icons';
function Page({ url, onClick, disabled, checked }: any) {

  const handleClick = () => {
    if (disabled) return;
    onClick()
  }

  return (
    <div className={classnames('g-d-ib g-p-4 g-c-p g-p-r', { 'g-o-02 g-c-na': disabled })} style={{ width: '25%', height: 108 }}>
      <img className="g-w-100per" src={url} alt="" onClick={handleClick} />
      {
        checked && !disabled &&
        <CheckCircleFilled style={{ position: 'absolute', top: 10, right: 10, color: '#52c41a', fontSize: 24 }} />
      }
    </div>
  )
}

export default Page