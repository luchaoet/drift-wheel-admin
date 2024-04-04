function APP(props: any = {}) {
  const p = {
    ...props,
    src: (process.env.REACT_APP_IMG_URL || 'http://www.drift-wheel.com:8081') + props.src
  }
  return <img {...p} />
}

export default APP