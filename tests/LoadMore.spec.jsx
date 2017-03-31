import expect from 'expect.js';
import React from 'react';
import { mount } from 'enzyme';
import LoadMore from '../src';

describe('LoadMore', () => {
  it('render correct', () => {
    mount(<LoadMore />);
  });
});

describe('Props', () => {
  let wrapper;

  it('className support', () => {
    wrapper = mount(<LoadMore className="test" />);
    expect(wrapper.component.getDOMNode().className).to.be('kuma-load-more test');
  });

  it('prefixCls support', () => {
    wrapper = mount(<LoadMore prefixCls="test" />);
    expect(wrapper.component.getDOMNode().className).to.be('test');
  });

});

describe('Locale', () => {
  let wrapper;

  it('loaded support', () => {
    wrapper = mount(<LoadMore locale="en-us" status="loaded" />);
    expect(wrapper.component.getDOMNode().innerText).to.be('View More');
  });

  it('loading support', () => {
    wrapper = mount(<LoadMore locale="en-us" status="loading" />);
    expect(wrapper.component.getDOMNode().innerText).to.be('Loading');
  });

  it('noMore support', () => {
    wrapper = mount(<LoadMore locale="en-us" status="noMore" />);
    expect(wrapper.component.getDOMNode().innerText).to.be('No More');
  });
});

describe('Overlay Text', () => {
  let wrapper;

  it('loadText support', () => {
    wrapper = mount(<LoadMore loadText="load text" />);
    expect(wrapper.component.getDOMNode().innerText).to.be('load text');
  });

  it('loadingText support', () => {
    wrapper = mount(<LoadMore loadingText="loading text" status="loading" />);
    expect(wrapper.component.getDOMNode().innerText).to.be('loading text');
  });

  it('noMoreText support', () => {
    wrapper = mount(<LoadMore noMoreText="no more text" status="noMore" />);
    expect(wrapper.component.getDOMNode().innerText).to.be('no more text');
  });
});

describe('Load', () => {
  let wrapper;

  it('view load support', () => {

    let loadTimes = 0;

    wrapper = mount(<div>
      <LoadMore
        trigger={['view']}
        onLoadMore={() => {
          loadTimes += 1;
        }}
      />
    </div>);
    expect(loadTimes).to.be(1);
  });

  it('click load support', () => {
    let loadTimes = 0;

    wrapper = mount(<LoadMore
      trigger={['click']}
      onLoadMore={() => {
        loadTimes += 1;
      }}
    />);
    expect(loadTimes).to.be(0);
    wrapper.find('a').simulate('click');
    expect(loadTimes).to.be(1);
  });

  it('scroll load support', () => {
    let loadTimes = 0;

    wrapper = mount(<LoadMore
      trigger={['view']}
      viewLoadDelay={10}
      onLoadMore={() => {
        loadTimes += 1;
      }}
    />);
    expect(loadTimes).to.be(1);

    wrapper.node.onScroll();

    window.setTimeout(() => {
      expect(loadTimes).to.be(2);
    }, 100);
  });

  it('scroll stop load support', () => {
    let loadTimes = 0;

    wrapper = mount(<LoadMore
      trigger={['view']}
      viewLoadDelay={10}
      onLoadMore={() => {
        loadTimes += 1;
      }}
    />);
    expect(loadTimes).to.be(1);

    wrapper.node.onScrollStop();

    expect(loadTimes).to.be(2);
  });
});
