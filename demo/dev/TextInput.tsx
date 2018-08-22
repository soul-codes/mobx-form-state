import React, { Component } from "react";
import { observer } from "mobx-react";
import { stateProjection, Input } from "../../src";
import randomId from "./utils/randomId";

export interface DevTextInputProps {
  input: Input<string>;
}

@observer
@stateProjection((component: DevTextInput, subscribe) => [
  subscribe(component.props.input, {
    focus: () => (component.el && (component.el.focus(), true)) || false,
    blur: () => (component.el && (component.el.blur(), true)) || false
  })
])
export default class DevTextInput extends Component<DevTextInputProps> {
  render() {
    const { input } = this.props;
    const id = randomId();
    const isHoveredValidator = input.validators.some(
      validator => validator.isHovered
    );

    return (
      <div
        style={{
          border: (isHoveredValidator ? 4 : 1) + "px solid black",
          margin: "1em",
          padding: isHoveredValidator
            ? "0em 1em 0em 1em"
            : "3px calc(1em + 3px) 3px calc(1em + 3px)",
          boxSizing: "border-box",
          display: "inline-block"
        }}
        onMouseOver={() => input.reportHover()}
        onMouseOut={() => input.reportUnhover()}
      >
        <p>
          <label htmlFor={id}>{input.name}</label>
        </p>
        <input
          id={id}
          type="text"
          value={input.inputValue}
          onChange={ev => input.input(ev.target.value)}
          onBlur={() => {
            input.reportBlur();
            input.confirm();
          }}
          onFocus={() => input.reportFocus()}
          onKeyPress={ev => ev.which === 13 && input.confirm({ next: true })}
          ref={el => (this.el = el)}
        />
        <p>Stable value: {input.value}</p>
        <p>{input.validators.length} validators</p>
      </div>
    );
  }
  el: HTMLInputElement | null = null;
}
