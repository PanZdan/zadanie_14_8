var GIPHY_API_URL = 'https://api.giphy.com/v1/gifs/random?api_key=',
    GIPHY_PUB_KEY = 'qAt0Z7brJVcMiLQ4xeBO2HEyorkir6Rt';


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
    this.getGif(searchingText).then(
      gif => this.setState({
        loading: false,  // a
        gif: gif,  // b
        searchingText: searchingText  // c
      })
    ).catch(error => console.error('Something went wrong', error));
  },
  getGif: function(searchingText) { 
    return new Promise(
      function(resolve, reject) {// 1.
        var url = GIPHY_API_URL + GIPHY_PUB_KEY + '&tag=' + searchingText;  // 2.
        var xhr = new XMLHttpRequest();  // 3.
        xhr.onload = function() {
          if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText).data; // 4.
            var gif = {  // 5.
              url: data.fixed_width_downsampled_url,
              sourceUrl: data.url
            };
            resolve(gif);  // 6.
          } else {
              reject(new Error(this.statusText)); // Dostaliśmy odpowiedź, ale jest to np 404
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
  // getGif: function(searchingText, callback) {  // 1.
  //   var url = 'https://api.giphy.com/v1/gifs/random?api_key=' + 'qAt0Z7brJVcMiLQ4xeBO2HEyorkir6Rt' + '&tag=' + searchingText;  // 2.
  //   var xhr = new XMLHttpRequest();  // 3.
  //   xhr.open('GET', url);
  //   xhr.onload = function() {
  //     if (xhr.status === 200) {
  //       var data = JSON.parse(xhr.responseText).data; // 4.
  //       var gif = {  // 5.
  //         url: data.fixed_width_downsampled_url,
  //         sourceUrl: data.url
  //       };
  //       callback(gif);  // 6.
  //     }
  //   };
  //   xhr.send();
  // },
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