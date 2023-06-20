import logo from './logo.svg';
import './App.css';

function App() {
  if(isLoggedIn){
  return (
    <div className="body">
      <div>{header()}</div>
      <main>
        <div>{favoriteArtists()}</div>
        <div>{genre()}</div>
        {/* Modal */}
        
      </main>

      </div>
    );
  }else{
      return (<div></div>);
  }
}

function header() {
  return (
    <header>
      <div className="container">
        <div className="row">
          <div className="col">
            <h3>Site Titles</h3>
          </div>
          <div className="col-6"></div>
          <div className="col">
            <h3>Profile</h3>
          </div>
        </div>
      </div>

      <div className="row text-center">
        <div className="col-6 mx-auto">
          <h2>Shows in Location</h2>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mx-auto">
          <form className="form">
            <input className="form-control" type="search" placeholder="Search by city" aria-label="Search" />
          </form>
        </div>
      </div>
    </header>
  );
}

function favoriteArtists() {
  return (
    <div className="container py-3">
      <h4>Your Favorite Artists</h4>
      <div className="row">
        <div className="col-3">{card({ name: "Artist Name", imageSrc: "images/MF-DOOM-Operation.jpeg", description: "Description" })}</div>
      </div>
    </div>
  );
}

function genre() {
  return (
    <div className="container py-3">
      <h4>Genre</h4>
      <div className="row">
        <div className="col-3">
          <div className="card">
            <img src="images/MF-DOOM-Operation.jpeg" alt="placeholder" className="card-img-top" />
            <div className="card-body">
              <h5 className="card-title">Artist Name</h5>
              <p className="card-text">Description</p>
            </div>
          </div>
        </div>
        <div className="col-3">
          <div className="card">
            <img src="images/MF-DOOM-Operation.jpeg" alt="placeholder" className="card-img-top" />
            <div className="card-body">
              <h5 className="card-title">Artist Name</h5>
              <p className="card-text">Description</p>
            </div>
          </div>
        </div>
        <div className="col-3">
          <div className="card">
            <img src="images/MF-DOOM-Operation.jpeg" alt="placeholder" className="card-img-top" />
            <div className="card-body">
              <h5 className="card-title">Artist Name</h5>
              <p className="card-text">Description</p>
            </div>
          </div>
        </div>
        <div className="col-3">
          <div className="card">
            <img src="images/MF-DOOM-Operation.jpeg" alt="placeholder" className="card-img-top" />
            <div className="card-body">
              <h5 className="card-title">Artist Name</h5>
              <p className="card-text">Description</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function modal(imageSrc) {
  return (
    <div className="modal fade modal-profile" tabindex="-1" role="dialog" aria-labelledby="modalProfile" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">Artist</h3>
            <button className="close" type="button" data-dismiss="modal">x</button>
          </div>
          <div className="modal-body">
            <img src={imageSrc} alt="Artist" className="img-fluid" />
          </div>
          <div className="modal-footer">
            <div className="row w-100">
              <div className="col">
                <p>Location</p>
                <p>Description</p>
                <h5>Get Tickets</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArtistCard(props) {
  const { name, imageSrc } = props;
  return (
    <div>
      <a href="#" title={name} className="thumb" data-toggle="modal" data-target=".modal-profile">
        <img src={imageSrc} alt={name} className="card-img-top" />
      </a>
      {modal(imageSrc)}
    </div>
  );
}

function card() {
  return (
    <div className="card">
      <ArtistCard imageSrc="images/MF-DOOM-Operation.jpeg" artistName="Artist Name" description="Description" />
      <div className="card-body">
        <h5 className="card-title">Artist Name</h5>
        <p className="card-text">Description</p>
      </div>
    </div>
  );
}

function navigation() {
  return (
    <div>
    <nav class="navbar navbar-light bg-light justify-content-between">
      <a class="navbar-brand">Navbar</a>
      <div>
        <input type="text" id="city"></input>
          <button onclick="search_city()"> Search</button>
          <button onclick="recommendConcert()"> Recommend </button>
      </div>
      <div id="weather-icon"></div>
    </nav><div class="container">
        <div class="row" id="cardContainer"></div>
      </div>
      </div>
  );
}

async function search_city() {
  let city = document.getElementById('city').value;
  console.log(city);
  let my_lat;
  let my_long;
  let dest_lat;
  let dest_long;

  const geoFindMe = () => {
    return new Promise((resolve, reject) => {
      const status = document.getElementById("status");

      const success = (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        my_lat = latitude;
        my_long = longitude;
        resolve();
      };

      const error = () => {
        status.textContent = "Unable to retrieve your location";
        reject();
      };

      if (!navigator.geolocation) {
        reject();
      } else {
        navigator.geolocation.getCurrentPosition(success, error);
      }
    });
  };

  try {
    await geoFindMe();

    const response = await fetch(`https://api.seatgeek.com/2/events?venue.city=${city}&client_id=MzM1MDUwODJ8MTY4MzQwNTgxMy42NjgxNTIz`);
    const data = await response.json();

    data.events.forEach((event) => {
      if (event.type === "concert") {
        console.log(event);
        console.log(event.url);
        dest_lat = event.venue.location.lat;
        dest_long = event.venue.location.lon;
        let miles = calculateDistance(my_lat, my_long, dest_lat, dest_long);
        if (event.performers && event.performers.length > 0) {
          const cardContainer = document.getElementById('cardContainer');
          event.performers.forEach((performer) => {
            if (performer.image) {
              const card = document.createElement('div');
              card.className = 'card';
              const performerImage = document.createElement('img');
              performerImage.src = performer.image;
              performerImage.alt = performer.name;
              performerImage.className = 'card-img-top';
              performerImage.style.marginBottom = '10px';
              card.appendChild(performerImage);
              const cardBody = document.createElement('div');
              cardBody.className = 'card-body';
              // const performerName = document.createElement('h3');
              // performerName.textContent = event.performers.name;
              // performer.names.forEach((name, index) => {
              //     if (index > 0) {
              //         performerName.innerHTML += ', ';
              //     }
              //     performerName.innerHTML += name;
              // });
              // cardBody.appendChild(performerName);
              const eventName = document.createElement('h3');
              eventName.textContent = event.title;
              cardBody.appendChild(eventName);
              // const performerNames = document.createElement('h5');
              // event.performers.forEach((performer) => {
              //     const artistName = performer.name;
              //     console.log(artistName);
              //     // Display or process the artist name as needed
              // });
              const performerNames = document.createElement('p');
              let namesString = "By ";
              event.performers.forEach((performer, index) => {
                const artistName = performer.name;
                if (index > 0) {
                  namesString += ", ";
                }
                namesString += artistName;
              });
              performerNames.textContent = namesString;
              cardBody.appendChild(performerNames);
              const eventDateTime = document.createElement('p');
              const datetime = new Date(event.datetime_local);
              const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
              eventDateTime.textContent = datetime.toLocaleDateString(undefined, options);
              cardBody.appendChild(eventDateTime);
              const milesElement = document.createElement('p');
              milesElement.textContent = `Miles: ${miles.toFixed(1)}`;
              cardBody.appendChild(milesElement);
              const eventUrlElement = document.createElement('a');
              eventUrlElement.href = event.url;
              eventUrlElement.textContent = 'Event Link';
              cardBody.appendChild(eventUrlElement);

              card.appendChild(cardBody);
              cardContainer.appendChild(card);
            }
          });
        }
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 3958.8;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    return distance;
  }

  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
  const apiKey = '5d070128504a470dac9221828230605';
  fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`)
    .then(response => response.json())
    .then(data => {
      const weatherCondition = data.current.condition.text;
      const weatherIcon = data.current.condition.icon;
      const fileName = weatherIcon.substring(weatherIcon.indexOf("x64") + 4);
      const folder_path = "file:///C:/Users/aarju/OneDrive/Documents/my_stuff/hackathon_api_work/weather/weather/64x64/";
      const final_url = folder_path + fileName;
      let weather_img = document.createElement('img');
      weather_img.src = final_url;
      weather_img.alt = weatherCondition;
      const weatherContainer = document.getElementById("weather-icon");
      weatherContainer.innerHTML = '';
      weatherContainer.appendChild(weather_img);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function recommendConcert() {
  const artistName = 'Taylor Swift'; // Specify the name of the artist
  // Encode the artist name for including in the URL
  const encodedArtistName = encodeURIComponent(artistName);

  // Construct the URL with the appropriate parameters
  const url = `https://api.seatgeek.com/2/recommendations?seed_type=performer&seed_id=${encodedArtistName}`;

  // Make the API request using fetch
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Process the returned data
      const recommendations = data.recommendations;
      // Access and utilize the recommended events and their information
      recommendations.forEach(recommendation => {
        const event = recommendation.event;
        const eventName = event.title;
        const eventDate = event.datetime_local;
        const venueName = event.venue.name;
        // ... Process and use other event details as needed
      });
    })
    .catch(error => {
      // Handle any errors that occur during the API request
      console.log('Error:', error);
    });
}

export default App;
