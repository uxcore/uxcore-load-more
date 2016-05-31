/**
 * LoadMore Component Demo for uxcore
 * @author peijie.dpj
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */

let classnames = require('classnames');

let LoadMore = require('../src');

let loadTimes = 0;

class Demo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loadState: 'loaded', // loading noMore
      lines: []
    }
  }

  onLoadMore() {
    let me = this;

    me.setState({
      loadState: 'loading'
    })

    setTimeout(function () {
      let lines = me.state.lines;

      if (++loadTimes < 5) {
        for (let i = 0; i < 50; i++) {
          lines.push(<p key={loadTimes + '-' + i}>第{loadTimes}次加载，当前是第{i + 1}条数据</p>)
        }

        me.setState({
          lines: lines,
          loadState: 'loaded'
        })
      } else {
        me.setState({
          loadState: 'noMore'
        })
      }
    }, 1000)

  }

  render() {
    let me = this;

    let props = {
      status: me.state.loadState,
      className: 'demo-class-name',
      trigger: ['view', 'click'],
      onLoadMore: me.onLoadMore.bind(me),
      locale: 'zh-cn',
      viewLoadDelay: 150,

      loadText: '查看更多',
      loadingText: '加载中',
      noMoreText: '没有更多'
    }

    return (
      <div className="demo-content">
        {me.state.lines}
        <LoadMore {...props}/>
      </div>
    );
  }
}
;

module.exports = Demo;
