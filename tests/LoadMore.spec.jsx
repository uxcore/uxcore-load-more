import expect from 'expect.js';
import React from 'react';
import ReactDOM from 'react-dom';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import LoadMore from '../src';

Enzyme.configure({ adapter: new Adapter() });

describe('LoadMore', () => {
  it('render correct', () => {
    mount(<LoadMore />);
  });
});

describe('Props', () => {
  let wrapper;

  it('className support', () => {
    wrapper = mount(<LoadMore className="test" />);
    expect(wrapper.hasClass('kuma-load-more test'));
  });

  it('prefixCls support', () => {
    wrapper = mount(<LoadMore prefixCls="test" />);
    expect(wrapper.hasClass('test'));
  });
});


describe('Locale', () => {
  let wrapper;

  it('loaded support', () => {
    wrapper = mount(<LoadMore locale="en-us" status="loaded" />);
    expect(wrapper.find('.kuma-load-more-status').text()).to.be('View More');
  });

  it('loading support', () => {
    wrapper = mount(<LoadMore locale="en-us" status="loading" />);
    expect(wrapper.find('.kuma-load-more-status').text()).to.be('Loading');
  });

  it('noMore support', () => {
    wrapper = mount(<LoadMore locale="en-us" status="noMore" />);
    expect(wrapper.find('.kuma-load-more-status').text()).to.be('No More');
  });
});

describe('Overlay Text', () => {
  let wrapper;

  it('loadText support', () => {
    wrapper = mount(<LoadMore loadText="load text" />);
    expect(wrapper.find('.kuma-load-more-status').text()).to.be('load text');
  });

  it('loadingText support', () => {
    wrapper = mount(<LoadMore loadingText="loading text" status="loading" />);
    expect(wrapper.find('.kuma-load-more-status').text()).to.be('loading text');
  });

  it('noMoreText support', () => {
    wrapper = mount(<LoadMore noMoreText="no more text" status="noMore" />);
    expect(wrapper.find('.kuma-load-more-status').text()).to.be('no more text');
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

    wrapper.instance().onScroll();
    wrapper.instance().onScroll();

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

    wrapper.instance().onScrollStop();

    expect(loadTimes).to.be(2);
  });
});