import React from 'react';
import { useIntl } from 'react-intl';

function HomePage() {
  let intl = useIntl();

  return (
    <div>
      <div>
        <h1>{ intl.formatMessage({ id: 'app.stats.homepage.header' }) }</h1>
        <p>{ intl.formatMessage({ id: 'app.stats.homepage.content' }) }</p>
      </div>
    </div>
  );
}

export default HomePage;
