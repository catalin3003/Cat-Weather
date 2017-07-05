let app = new Vue({
	el: '#wapp',
	data: {
		weather_img: "",
		month: "",
        month_quote: "",
		day: "",
		day_sup: "",
		place: "London, GB",
		city: "",
		country: "",
		weather_descrip: '',
		kelvin_temp: '',
        kelvin_temp_min: '',
        kelvin_temp_max: '',
		humidity: '',
		clouds: '',
		wind: '',
		apiSunrise: '',
		apiSunset: '',
        sunriseDate:'',
		wind_speed: '',
		temp_unit: "C",
		speed_unit: "m/s",
		main_icon: "",
		direction_icon: ""
	},
	computed: {
		month: function(){
			let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			now = new Date();
			return monthNames[now.getMonth()];
		},
        month_quote: function(){
            let monthNamesQuote = [
            	"It does not matter how slowly you go as long as you do not stop.",
				"There are no mistakes, only opportunities.",
				"The only person you are destined to become is the person you decide to be.",
				"Either you run the day, or the day runs you.",
				"Every strike brings me closer to the next home run.",
				"As you grow older, you will discover thAt you have two hands. One for helping yourself, and one for helping others.",
				"Don't count the days, make the days count.",
				"You can't use up creativity. The more you use, the more you have.",
				"Success is the sum of all small efforts, repeated day-in and day-out.",
				"Believe that you can and you're halfway there.",
				"It is better to fail in originality than to succeed in imitation.",
				"The question isn't who is going to let me; it's who is going to stop me."];
            now = new Date();
            return monthNamesQuote[now.getMonth()];
        },
		day: function(){
			now = new Date();
			return now.getDate();
		},
		day_sup: function () {
            let daySup = [" ", "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "st"];
            now = new Date();
            return daySup[now.getDate()];
        },
		temp: function(){
			if(this.temp_unit=="C"){
				return (this.kelvin_temp-273.15).toFixed(0);
			} else {
				return (this.kelvin_temp*9/5-459.67).toFixed(0);
			}
		},
        temp_min: function(){
            if(this.temp_unit=="C"){
                return (this.kelvin_temp_min-273.15).toFixed(0);
            } else {
                return (this.kelvin_temp_min*9/5-459.67).toFixed(0);
            }
        },
        temp_max: function(){
            if(this.temp_unit=="C"){
                return (this.kelvin_temp_max-273.15).toFixed(0);
            } else {
                return (this.kelvin_temp_max*9/5-459.67).toFixed(0);
            }
        },
		wind_speed: function(){
			if(this.temp_unit=="F"){
				return (this.wind*0.000621371*3600).toFixed(2);
			}
			return this.wind;
		}
	},
	created: function(){
		this.getWeatherData();
		this.$watch('place', function(){
			this.getWeatherData();
		});
	},
	methods: {
		getWeatherData: function(){
			encoded_place = this.place.replace(/ /g,'');
			api_key = "f0a2c2834ce0564476a07dc2627a5baf";
			this.$http.get("http://api.openweathermap.org/data/2.5/weather?q="+encoded_place+"&appid="+api_key).then(function(response){
				this.weather_descrip = response['data']['weather'][0]['description'];
				this.country = response['data']['sys']['country'];
				this.city = response['data']['name'];
				this.kelvin_temp = response['data']['main']['temp'];
                this.kelvin_temp_min = response['data']['main']['temp_min'];
                this.kelvin_temp_max = response['data']['main']['temp_max'];
				this.humidity = response['data']['main']['humidity'];
				this.clouds = response['data']['clouds']['all'];
				this.wind = response['data']['wind']['speed'];
				this.apiSunrise = response ['data']['sys']['sunrise']; // ToDo: convert unix timestamp
				this.apiSunset = response ['data']['sys']['sunset']; // ToDo: convert unix timestamp
				icon_prefix = 'wi wi-owm-';
				code = response['data']['weather'][0]['id'];
				img_icon = weatherIcons[code].icon;
				this.weather_img = "img/weather-img/"+img_icon+".jpeg";
				let xsunrise = [7, 11]; // ToDo: get data from apiSunrise
                let xsunset = [21, 11]; // ToDo: get data from apiSunset
                let sunrise_m = xsunrise[0] * 60 + xsunrise[1];
                let sunset_m = xsunset[0] * 60 + xsunset[1];
                let now = new Date();
                let now_m = now.getHours() * 60 + now.getMinutes()
				if (now_m > sunrise_m && now_m <= sunset_m) {
					img_icon = 'day-' + code;
				}
				else {
                    img_icon = 'night-' + code;
				}
				this.main_icon = icon_prefix + img_icon;
			});
		},
		setLocation: function(){
			this.place = $("input#location").val();
			$(".weather-widget").toggleClass("search-toggled");
			$("input#location").val('');
		},
		toggleUnit: function(){
			if(this.temp_unit=="C"){
				this.temp_unit = "F";
				this.speed_unit = "mi/hr"
			} else {
				this.temp_unit = "C";
				this.speed_unit = "m/s"
			}
		}
	}
});
$(function(){
    $("#locationsearch, .back-btn").on("click", function(){
        $(".weather-widget").toggleClass("search-toggled");
        $("input#location").focus();
    });
});