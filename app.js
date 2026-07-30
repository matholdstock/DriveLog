alert("DriveLog loaded");
let activeTrip = null;

let watchID = null;

let totalDistance = 0;

let lastPosition = null;

let timerInterval = null;

let startTime = null;



function showPage(page){

    document.querySelectorAll(".page")
    .forEach(p=>{
        p.classList.remove("active");
    });


    document.getElementById(page)
    .classList.add("active");

}




function startTrip(type){


    if(!navigator.geolocation){

        alert("GPS not supported");

        return;
    }


    activeTrip = {

        type:type,

        start:new Date()

    };


    totalDistance=0;

    lastPosition=null;


    document.getElementById("tripStatus")
    .classList.remove("hidden");


    document.getElementById("tripType")
    .innerHTML =
    type+" Trip";


    startTime=new Date();


    startTimer();


    startGPS();


}




function startGPS(){


    watchID =
    navigator.geolocation.watchPosition(

        updatePosition,


        gpsError,


        {

        enableHighAccuracy:true,

        maximumAge:0,

        timeout:10000

        }

    );


}




function updatePosition(position){


    let lat =
    position.coords.latitude;


    let lon =
    position.coords.longitude;



    let speed =
    position.coords.speed;



    if(lastPosition){


        let distance =
        calculateDistance(

            lastPosition.lat,

            lastPosition.lon,

            lat,

            lon

        );


        totalDistance += distance;


        document.getElementById("distance")
        .innerHTML =
        totalDistance.toFixed(2)+" km";

    }



    lastPosition={

        lat:lat,

        lon:lon

    };



    if(speed){

        document.getElementById("speed")
        .innerHTML =
        (speed*3.6).toFixed(0)
        +" km/h";

    }


}




function calculateDistance(lat1,lon1,lat2,lon2){


    const R = 6371;


    let dLat =
    (lat2-lat1)
    *Math.PI/180;


    let dLon =
    (lon2-lon1)
    *Math.PI/180;



    let a =

    Math.sin(dLat/2) *
    Math.sin(dLat/2)

    +

    Math.cos(lat1*Math.PI/180)

    *

    Math.cos(lat2*Math.PI/180)

    *

    Math.sin(dLon/2)

    *

    Math.sin(dLon/2);



    let c =
    2*Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1-a)
    );


    return R*c;

}




function gpsError(error){

    alert(
    "GPS Error: "
    +error.message
    );

}




function startTimer(){


    timerInterval =
    setInterval(()=>{


        let seconds =
        Math.floor(
        (new Date()-startTime)/1000
        );


        let h =
        Math.floor(seconds/3600);


        let m =
        Math.floor(
        (seconds%3600)/60
        );


        let s =
        seconds%60;



        document.getElementById("timer")
        .innerHTML =

        `${pad(h)}:${pad(m)}:${pad(s)}`;


    },1000);


}




function pad(num){

    return num
    .toString()
    .padStart(2,"0");

}




function endTrip(){


    if(watchID){

        navigator.geolocation
        .clearWatch(watchID);

    }



    clearInterval(timerInterval);



    alert(

    activeTrip.type+

    " trip saved\n\n"+

    totalDistance.toFixed(2)

    +" km"

    );



    activeTrip=null;



    document.getElementById("tripStatus")
    .classList.add("hidden");

}
