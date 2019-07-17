import React, { Component } from 'react';

class TreeNode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
    };
  }

  toggle = e => {
    e.preventDefault();
    this.setState((prevState, props) => {
      return { expanded: !prevState.expanded };
    });
  };

  render() {
    const cname = this.state.expanded ? 'tree-node-arrow' : 'tree-node-arrow tree-node-hide';
    return (
      <div className={!this.props.value && 'tree-node-untitled'}>
        <div className={cname} onClick={this.toggle} />
        <span>{this.props.value}</span>
        {this.state.expanded && <div className="tree-node-content">{this.props.children}</div>}
      </div>
    );
  }
}

export { TreeNode };
