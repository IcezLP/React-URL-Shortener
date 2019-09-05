import React, { Component } from 'react';
import './app.css';
import Validator from 'validator';
import axios from 'axios';
import ClipboardJS from 'clipboard';

class App extends Component {
  constructor(){
    super();

    this.state = {
      url: '',
      shortenedUrl: '',
      loading: false,
      error: '',
    }
  }

  onSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true });

    const { url } = this.state;

    const {error, isValid} = this.validateUrl(url);

    if (!isValid){
      this.setState({ error, loading: false, })
      return;
    }

    this.setState({ error: '' })

    const response = await axios.post('/short', { url })

    this.setState({
      shortenedUrl: response.data.url,
      loading: false,
    });
  }

  validateUrl = (url) => {
    let error = '';

    if (!Validator.isURL(url)){
      error = 'This URL is not valid';
    }

    if (Validator.isEmpty(url)){
      error = 'Please enter URL';
    }

    return {
      error,
      isValid: Validator.isEmpty(error)
    }
  }

  render() {
    const { url, shortenedUrl, error, loading } = this.state;
    const clipboard = new ClipboardJS('.shortened');

    return (
      <div className="container">
        <form className="form" noValidate onSubmit={this.onSubmit}>
          <h1 className="title">URL Shortener</h1>
          <input
            type="text"
            aria-label="Url"
            name="url"
            className={error ? 'input error' : 'input'}
            placeholder="Url to shorten"
            value={url}
            onChange={(e) => this.setState({url: e.target.value})}
          />
          {error &&  <small className="text-error">{error}</small>}
          <button type="submit" className="button" disabled={loading}>{loading ? 'Loading' : 'Shorten'}</button>
          {shortenedUrl && <h3 className="shortened" data-clipboard-target=".shortened">{shortenedUrl}</h3>}
        </form>
      </div>
    )
  }
}

export default App;