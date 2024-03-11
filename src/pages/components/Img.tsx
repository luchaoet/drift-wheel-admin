function APP(props: any = {}) {
  const p = {
    ...props,
    src: process.env.REACT_APP_IMG_URL + props.src
  }
  return <img {...p} />
}

export default APP