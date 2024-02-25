import { useEffect, useState } from 'react'
import { copy, linkIcon, loader, tick } from '../assets'

import { useLazyGetSummaryQuery } from '../services/article'

const Demo = () => {

  const [article, setArticle] = useState({
    url: '',
    summary: ''
  })

  const [copied, setCopied] = useState("")

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery()
  const [articlesList, setArticlesList] = useState([])

  useEffect(() => {
    const artilcesFromLocalStorage = JSON.parse(
      localStorage.getItem('article')
    )

    if(artilcesFromLocalStorage){
      setArticlesList(artilcesFromLocalStorage)
    }
  }, [])

  const handleSubmit = async (e) =>{
    e.preventDefault()
    const { data } = await getSummary({ articleUrl: article.url})

    if(data?.summary){
      const newArticle = {...article, summary: data.summary}
      const updatedArticlesList = [newArticle, ...articlesList]
      
      setArticle(newArticle)
      setArticlesList(updatedArticlesList)

      localStorage.setItem('article', JSON.stringify(updatedArticlesList))
    }
  }

  const handleCopy = (copyUrl) => {
    setCopied(copyUrl)
    navigator.clipboard.writeText(copyUrl)
    setTimeout(()=> setCopied(false), 3000)
  }

  return (
    <section className='mt-6 w-full max-w-xl'>
      <div className='flex flex-col w-full gap-2'>
        <form onSubmit={handleSubmit} className='relative flex justify-center items-center'>
          <img className='absolute left-0 my-2 ml-3 w-5' src={linkIcon} alt='link_icon' />
          <input className='url_input peer' type='url' value={article.url} onChange={(event) => setArticle({
            ...article, url: event.target.value
          })} required placeholder='Enter a URL' />
          <button type='submit' className='submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700'>↵</button>
        </form>
        <div className='flex flex-col gap-1m max-h-60 overflow-y-auto'>
            {
              articlesList.map((item, index) => (
                <div key={`link-${index}`}
                  onClick={() => setArticle(item)}
                  className='my-1 link_card'>
                    <div onClick={() => handleCopy(item.url)} className='copy_btn'>
                      <img src={copied === item.url ? tick : copy} alt='copy_icon' className='w-[40%] h-[40%] object-contain' />
                    </div>
                    <p className='flex-1 font-satoshi text-blue-700 font-medium text-sm truncate'>{item.url}</p>
                </div>
              ))
            }

          </div>
      </div>

      <div className='my-10 max-w-full flex justify-center items-center'>
        {isFetching ? (
          <img src={loader} alt='loader' className='w-20 h-20 object-contain' />) : error ? (
            <p className='font-inter font-bold text-black text-center'>Well, that wasn't suppose to happen...
            <br />
            <span className='font-satoshi font-normal text-gray-700'>{error?.data?.error}</span></p>
          ) : (
            article.summary && (
              <div className='flex flex-col gap-3'>
                <h2 className='font-satoshi font-bold text-gray-600 text-xl'>
                  Article <span className='blue_gradient'>Summary</span>
                </h2>
                <div className='summary_box'>
                  <p className='font-inter font-medium text-sm text-gray-700'>
                  {article.summary}
                  </p>
                </div>
              </div>
            )
          )}
      </div>
    </section>
  )
}

export default Demo