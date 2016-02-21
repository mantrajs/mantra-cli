import React from 'react';

const Home = React.createClass({
  render() {
    return (
      <div>
        <h1>Mantra</h1>
        <p>
          Welcome to Mantra 0.2.0.
        </p>
        <p>
          <ul>
            <li>
              Read <a target="_blank" href="https://kadirahq.github.io/mantra/">spec</a>
            </li>
            <li>
              Learn <a target="_blank" href="https://github.com/sungwoncho/mantra-cli#commands">CLI</a>
            </li>
          </ul>
        </p>
      </div>
    );
  }
});

export default Home;
