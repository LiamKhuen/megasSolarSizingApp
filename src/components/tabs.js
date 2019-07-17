import React, { Component } from 'react';

class Tab extends Component {
  render() {
    const className = this.props.active ? "tab tab-active" : "tab";

    return (
      <div className={className} onClick={this.props.onClick}>{this.props.children}</div>
    );
  }
}

class TabContent extends Component {
  render() {
    if (!this.props.active) return null;
    return (
      <div className="tab-container">{this.props.children}</div>
    );
  }
}

class TabButtonGroup extends Component {
  render() {
    return <div className="tab-btn-group">{this.props.children}</div>;
  }
}

export { Tab, TabButtonGroup, TabContent };
