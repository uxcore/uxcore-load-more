/**
 * LoadMore Component for uxcore
 * @author peijie.dpj
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */

"use strict";

const React = require('react');
const classnames = require('classnames');
const lang = require('./i18n');

let scrollTimer;

class LoadMore extends React.Component {

  constructor(props) {
    super(props);

    this.lang = lang[props.locale.toLocaleLowerCase()];
  }

  componentDidMount() {
    let me = this,
      props = me.props;

    let hasView = props.trigger.some(function(item) {
      return item == 'view';
    })

    if (hasView && typeof window == 'object') {
      if (window.addEventListener) {
        window.addEventListener('scroll', me.onScroll.bind(me));
      } else if (window.attachEvent) {
        window.attachEvent('onscroll', me.onScroll.bind(me))
      }

      // 第一屏判断
      if (me.isElementInView(me.refs.viewMore)) {
        props.onLoadMore();
      }
    }
  }

  /**
   * 滚动事件
   */
  onScroll() {
    let me = this,
      props = me.props;

      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }

      scrollTimer = setTimeout(me.onScrollStop.bind(me), props.viewLoadDelay);
  }

  /**
   * 滚动停止一段时间之后才判断
   */
  onScrollStop() {
    let me = this,
      props = me.props;

    if (me.isElementInView(me.refs.viewMore)) {
      props.onLoadMore()
    }
  }

  onClick() {
    let me = this,
      props = me.props;

    let hasClick = props.trigger.some(function(item) {
      return item == 'click';
    })

    if (hasClick) {
      props.onLoadMore();
    }
  }

  isElementInView(element) {
    if (!element || typeof window !== 'object') {
      return false;
    }

    const threshold = 0,
          innerHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,

          viewTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop,
          viewBottom = viewTop + innerHeight,

          elementTop = (!!element && !!element.getBoundingClientRect) && (element.getBoundingClientRect().top + viewTop),
          elementBottom = elementTop + element.offsetHeight,

          offset = (threshold / 100) * innerHeight;

    return (viewTop - offset <= elementBottom) && (elementTop <= viewBottom + offset);
  }

  _renderLoadStatus() {
    let me = this,
      props = me.props,
      lang = me.lang,
      res;

    switch (props.status) {
      case 'loaded':
        res = <a href="javascript:void(0)" className={`${props.prefixCls}-status`} ref="viewMore" onClick={me.onClick.bind(me)}>{'loadText' in props ? props.loadText : lang.viewMore}</a>;
        break;

      case 'loading':
        res = <a href="javascript:void(0)" className={`${props.prefixCls}-status`}><i className={`${props.prefixCls}-icon-loading`}></i>{'loadingText' in props ? props.loadingText : lang.loading}</a>;
        break;

      case 'noMore':
        res = <a href="javascript:void(0)" className={`${props.prefixCls}-status ${props.prefixCls}-noMore`}>{'noMoreText' in props ? props.noMoreText : lang.noMore}</a>;
        break;
    }

    return res;
  }


  render() {
    let me = this,
      props = me.props;

    return (
      <div className={classnames(props.prefixCls, {
        [props.className] : !!props.className
      })}>{me._renderLoadStatus()}</div>
    );
  }
}

LoadMore.defaultProps = {
  prefixCls: 'kuma-load-more',
  status: 'loaded',
  className: '',
  trigger: ['view', 'click'],
  onLoadMore: () => {},
  locale: 'zh-cn',
  viewLoadDelay: 150
}


// http://facebook.github.io/react/docs/reusable-components.html
LoadMore.propTypes = {
  prefixCls: React.PropTypes.string,
  status: React.PropTypes.oneOf(['loaded', 'loading', 'noMore']),
  className: React.PropTypes.string,
  trigger: React.PropTypes.array,
  onLoadMore: React.PropTypes.func,
  locale: React.PropTypes.oneOf(['zh-cn', 'en-us']),
  viewLoadDelay: React.PropTypes.number
}

LoadMore.displayName = "LoadMore";

module.exports = LoadMore;
