import React, { useEffect, useState } from 'react'
import NewsItem from './NewsItem'
import PropTypes from 'prop-types'
import Spinner from './Spinner';
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
    // articles = [ ]
    // we can set default props and proptypes in rce also by creating static objects
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    // document.title = `${props.category[0].toUpperCase() + props.category.slice(1)}-NewsMonkey`


    const update = async () => {
        props.setProgress(10);
        const url = ` https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
        setLoading(true)
        let data = await fetch(url);
        props.setProgress(30);
        let parsedata = await data.json();
        console.log(parsedata);
        props.setProgress(50);
        setArticles(parsedata.articles);
        setLoading(false);
        setTotalResults(parsedata.totalResults);
        // this.setState({ articles: parsedata.articles, totalResults: parsedata.totalResults, loading: false });
        props.setProgress(100);
    }
    useEffect(() => {
        document.title = `${props.category[0].toUpperCase() + props.category.slice(1)}-NewsMonkey`
        update();
    }, [])

    // handlePrevbtn = async () => {
    //     this.setState({ page: this.state.page - 1 })
    //     this.update();
    // }

    // handleNextbtn = async () => {
    //     this.setState({ page: this.state.page + 1 })
    //     this.update();
    // }
    const fetchMoreData = async () => {

        const url = ` https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
        setPage(page + 1);
        // this.setState({ loading: true })
        let data = await fetch(url);
        let parsedata = await data.json();
        console.log(parsedata);


        setArticles(articles.concat(parsedata.articles));
        setTotalResults(parsedata.totalResults);
    }

    return (
        <>
            <h1 className='text-center' style={{marginTop:'90px'}}>NewsMonkey- Top {props.category[0].toUpperCase() + props.category.slice(1)} headlines</h1>
            {loading && <Spinner />}

            <InfiniteScroll
                dataLength={articles.length}
                next={fetchMoreData}
                hasMore={articles.length !== totalResults}
                loader={<Spinner />} >
                <div className="container">
                    <div className="row" >
                        {!loading && articles.map((element) => {

                            return <div className="col-md-4" key={element.publishedAt}>
                                {/* wheneve we returning lthings like this we need to give a unique key to each value */}
                                <NewsItem title={element.title} description={element.description} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} />
                            </div>
                        })}
                    </div>
                </div>
            </InfiniteScroll>
        </>
    )

}


News.defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general'
}
News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
}
export default News
