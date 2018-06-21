/**
 * LoadMore Component for uxcore
 * @author peijie.dpj
 *
 * Copyright 2015-2017, Uxcore Team, Alinw.
 * All rights reserved.
 */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Lang from './i18n';

let scrollTimer;

function isElementInView(element) {
  if (!element || typeof window !== 'object') {
    return false;
  }

  const threshold = 0;
  const innerHeight = window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  const viewTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
  const viewBottom = viewTop + innerHeight;
  const elementTop = (!!element && !!element.getBoundingClientRect) &&
    (element.getBoundingClientRect().top + viewTop);
  const elementBottom = elementTop + element.offsetHeight;
  const offset = (threshold / 100) * innerHeight;

  return (viewTop - offset <= elementBottom) && (elementTop <= viewBottom + offset);
}

class LoadMore extends React.Component {

  constructor(props) {
    super(props);

    this.lang = Lang[props.locale.toLocaleLowerCase()];
  }

  componentDidMount() {
    const me = this;
    const props = me.props;

    const hasView = props.trigger.some((item) => {
      return item === 'view';
    });

    if (hasView && typeof window === 'object') {
      if (window.addEventListener) {
        window.addEventListener('scroll', me.onScroll.bind(me));
      } else if (window.attachEvent) {
        window.attachEvent('onscroll', me.onScroll.bind(me));
      }

      // 第一屏判断
      if (isElementInView(me.refs.viewMore)) {
        props.onLoadMore();
      }
    }
  }

  /**
   * 滚动事件
   */
  onScroll() {
    const me = this;
    const props = me.props;

    if (scrollTimer) {
      clearTimeout(scrollTimer);
    }

    scrollTimer = setTimeout(me.onScrollStop.bind(me), props.viewLoadDelay);
  }

  /**
   * 滚动停止一段时间之后才判断
   */
  onScrollStop() {
    const me = this;
    const props = me.props;

    if (isElementInView(me.refs.viewMore)) {
      props.onLoadMore();
    }
  }

  onClick() {
    const me = this;
    const props = me.props;

    const hasClick = props.trigger.some((item) => {
      return item === 'click';
    });

    if (hasClick) {
      props.onLoadMore();
    }
  }

  renderLoadStatus() {
    const me = this;
    const props = me.props;
    const lang = me.lang;
    let res;

    switch (props.status) {
      case 'loaded':
        res = (
          <a
            href="javascript:void(0)"
            className={`${props.prefixCls}-status`}
            ref="viewMore"
            onClick={me.onClick.bind(me)}
          >
            {'loadText' in props ? props.loadText : lang.viewMore}
          </a>);
        break;

      case 'loading':
        res = (
          <a
            href="javascript:void(0)"
            className={`${props.prefixCls}-status`}
          >
            <i className={`${props.prefixCls}-icon-loading`} />
            {'loadingText' in props ? props.loadingText : lang.loading}
          </a>);
        break;

      case 'noMore':
        res = (
          <a
            href="javascript:void(0)"
            className={`${props.prefixCls}-status ${props.prefixCls}-noMore`}
          >
            {'noMoreText' in props ? props.noMoreText : lang.noMore}
          </a>);
        break;

      default:
        break;
    }

    return res;
  }


  render() {
    const props = this.props;

    return (
      <div
        className={classnames(props.prefixCls, {
          [props.className]: !!props.className,
        })}
      >
        {this.renderLoadStatus()}
      </div>
    );
  }
}

LoadMore.defaultProps = {
  prefixCls: 'kuma-load-more',
  status: 'loaded',
  className: '',
  trigger: ['view', 'click'],
  onLoadMore: () => { },
  locale: 'zh-cn',
  viewLoadDelay: 150,
};


// http://facebook.github.io/react/docs/reusable-components.html
LoadMore.propTypes = {
  prefixCls: PropTypes.string,
  status: PropTypes.oneOf(['loaded', 'loading', 'noMore']),
  className: PropTypes.string,
  trigger: PropTypes.array,
  onLoadMore: PropTypes.func,
  locale: PropTypes.oneOf(['zh-cn', 'en-us']),
  viewLoadDelay: PropTypes.number,
};

LoadMore.displayName = 'LoadMore';

module.exports = LoadMore;
