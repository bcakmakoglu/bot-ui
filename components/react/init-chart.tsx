import React from 'react';
import ReactDOM from 'react-dom';
import ReactFlow, { Elements, OnLoadParams } from 'react-flow-renderer';
import DemoFlow from './demo-flow';

export const init = (hookableEl: HTMLElement, elements: Elements, clickEvent: any) => {
  ReactDOM.render(
    <React.StrictMode>
      <ReactFlow onClick={clickEvent} elements={elements} snapToGrid={true} snapGrid={[15, 15]} />
    </React.StrictMode>,
    hookableEl
  );
};

export const initDemo = (hookableEl: HTMLElement, onLoadCb: (reactFlowInstance: OnLoadParams) => void) => {
  ReactDOM.render(
    <React.StrictMode>
      <DemoFlow cb={onLoadCb} />
    </React.StrictMode>,
    hookableEl
  );
};
