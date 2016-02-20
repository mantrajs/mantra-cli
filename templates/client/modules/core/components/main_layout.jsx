import React from 'react';

const Layout = ({content = () => null }) => (
  <div>
    <div>
      {content()}
    </div>
  </div>
);

export default Layout;
