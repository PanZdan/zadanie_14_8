App = React.createClass({
  getInitialState() {
    return {
      loading: false,
      searchingText: '',
      gif: {}
    };
  },
  handleSearch: function(searchingText) {  // 1.
    this.setState({
      loading: true  // 2.
    });
    this.getGif(searchingText, function(gif) {  // 3.
      this.setState({  // 4
        loading: false,  // a
        gif: gif,  // b
        searchingText: searchingText  // c
      });
    }.bind(this));
  },
  getGif: function(searchingText) {
    return new Promise(
      function (resolve, reject) {
        var url = 'http://api.giphy.com/v1/gifs/random?api_key=' + 'qAt0Z7brJVcMiLQ4xeBO2HEyorkir6Rt' + '&tag=' + searchingText;
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
          if (this.status === 200) {
            var data = JSON.parse(this.responseText).data;
            var gif = {
                url: data.fixed_width_downsampled_url,
                sourceUrl: data.url
            };
            resolve(gif);
          } else {
            reject(new Error(this.statusText));
          }
        };
        xhr.onerror = function () {
            reject(new Error(
                `XMLHttpRequest Error: ${this.statusText}`));
            };
        xhr.open('GET', url);
        xhr.send();
      }
    );
  },
  render: function() {

    var styles = {
      margin: '0 auto',
      textAlign: 'center',
      width: '90%'
    };

    return (
      <div style={styles}>
        <h1>Wyszukiwarka GIFow!</h1>
        <p>Znajdź gifa na <a href='http://giphy.com'>giphy</a>. Naciskaj enter, aby pobrać kolejne gify.</p>
        <Search onSearch={this.handleSearch}/>
        <Gif
          loading={this.state.loading}
          url={this.state.gif.url}
          sourceUrl={this.state.gif.sourceUrl}
        />
      </div>
    );
  }
});