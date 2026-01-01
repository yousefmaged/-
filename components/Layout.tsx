
import React from 'react';
import Sidebar from './Sidebar';
import Editor from './Editor/Editor';

const Layout: React.FC = () => {
  return (
    <div className="flex w-full h-screen overflow-hidden">
      <Sidebar />
      <Editor />
    </div>
  );
};

export default Layout;
