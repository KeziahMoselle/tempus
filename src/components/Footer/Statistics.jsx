import React, { useState, useEffect } from 'react'

export default () => {
  const [data, setData] = useState(undefined)
  useEffect(() => {
    window.ipcRenderer.send('getData')
    window.ipcRenderer.once('getData', (event, storeData) => setData(storeData))
  }, [])
  
  return (
    <>
      {
        data &&
        <p>{ data }</p>
      }

      { !data &&
        <div class="circle-ripple"></div>
      }
    </>
  )
}