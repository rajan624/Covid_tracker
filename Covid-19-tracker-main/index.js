const search=document.querySelector('#search');
const confirmed=document.querySelector('.confirmed');
const deaths=document.querySelector('.deaths');
const recovered=document.querySelector('.recovered');
const datalist=document.querySelector('#datalist');
const date=document.querySelector('#date');
const countryname=document.querySelector('#name-country');
const chart=document.querySelector('#chartContainer');

var graphdata=[];

async function covidtrack(country){
    datalist.innerHTML=`<Option value="World">World</Option>`;
    resetvalue(confirmed);
    resetvalue(deaths);
    resetvalue(recovered);

    const res = await fetch("https://api.covid19api.com/summary");
    const data = await res.json();
    //console.log(country);
    //console.log(res);
    //console.log(data);

    if(res.status==200){
        date.innerHTML=new Date(data.Date).toDateString();

        if(country=='World' || country==''){

            const totalconfirmed=data.Global.TotalConfirmed;
            const totaldeaths=data.Global.TotalDeaths;
            const totalrecovered=data.Global.TotalRecovered;
            total(totalconfirmed, totaldeaths,totalrecovered);
            
            const newconfirmed=data.Global.NewConfirmed;
            const newdeaths=data.Global.NewDeaths;
            const newrecovered=data.Global.NewRecovered;
            update(newconfirmed,newdeaths,newrecovered);

            countryname.innerHTML='World';
            graphdata=[ totalconfirmed,totaldeaths,totalrecovered];
        }
        data.Countries.forEach((element)=>{

            const option=document.createElement('option');
            option.value=element.Country;
            option.textContent = element.Country;
            datalist.appendChild(option);
            if(country==element.Country){
                const totalconfirmed=element.TotalConfirmed;
                const totaldeaths=element.TotalDeaths;
                const totalrecovered=element.TotalRecovered;
                total(totalconfirmed, totaldeaths,totalrecovered);
                
                const newconfirmed=element.NewConfirmed;
                const newdeaths=element.NewDeaths;
                const newrecovered=element.NewRecovered;
                update(newconfirmed,newdeaths,newrecovered);
    
                countryname.innerHTML=element.Country;
                graphdata=[ totalconfirmed,totaldeaths,totalrecovered];
            }
        });
        drawgraph(graphdata);
    }
}

async function covidtrackindia(state){

    resetvalue(confirmed);
    resetvalue(deaths);
    resetvalue(recovered);

    const res = await fetch("https://data.covid19india.org/data.json");
    const data = await res.json();
    //console.log(state);
    //console.log(res);
    //console.log(data);

    if(res.status==200){
        date.innerHTML=data.statewise[0].lastupdatedtime;

        if(state==''){

            const totalconfirmed=data.statewise[0].confirmed;
            const totaldeaths=data.statewise[0].deaths;
            const totalrecovered=data.statewise[0].recovered;
            total(totalconfirmed, totaldeaths,totalrecovered);
            
            //const newconfirmed=data.statewise.NewConfirmed;
            //const newdeaths=data.statewise.NewDeaths;
            //const newrecovered=data.statewise.NewRecovered;
            //update(newconfirmed,newdeaths,newrecovered);

            countryname.innerHTML='India';

            graphdata=[ totalconfirmed,totaldeaths,totalrecovered];
        }
        data.statewise.forEach((element)=>{
             
            const option=document.createElement('option');
            option.value=element.state;
            option.textContent = element.state;
            datalistindia.appendChild(option);
            if(state==element.state){
                const totalconfirmed=element.confirmed;
                const totaldeaths=element.deaths;
                const totalrecovered=element.recovered;
                total(totalconfirmed, totaldeaths,totalrecovered);
                
                //const newconfirmed=element.NewConfirmed;
                //const newdeaths=element.NewDeaths;
                //const newrecovered=element.NewRecovered;
                //update(newconfirmed,newdeaths,newrecovered);
    
                countryname.innerHTML=element.state;

                graphdata=[ totalconfirmed,totaldeaths,totalrecovered];
            }
        });
        drawgraph(graphdata);
    }   
}

let speed=100;

function counting(target,start){

    let inc=target/speed;
    let count=parseInt(start.innerHTML);
    //console.log(count);

    if(count<target){
        start.innerHTML=Math.ceil(count+inc);
        setTimeout(()=>{
           counting(target,start);
        },5);
    }
    else{
        start.innerHTML=target;
    }
}

function drawgraph(graphdata){
    chart.innerHTML="";
    const canvas=document.createElement('canvas');
    canvas.setAttribute('id','canvas');
    chart.appendChild(canvas);
    var ctx = document.getElementById('canvas').getContext('2d');

    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['TOTAL CONFIRMED', 'TOTAL DEATHS', 'TOTAL RECOVERED'],
            datasets: [{
                label: countryname.innerHTML,
                data: graphdata,
                backgroundColor: [
                    '#c0392b','#34495e','#2ecc71'
                ],
                borderColor: [
                    '#d35400',
                    '#2c3e50',
                    '#27ae60',
                ],
                 borderWidth: 2
            }]
        },
        options: {
           responsive: true,
           layout: {
               padding:{
                   top:10,
               },
           },
           animation:{
               duration:5000,
               easing:"easeInOutBounce",
           },
           plugins: {
            title: {
                display: true,
                text: 'Graphical Representation',
                font: {
                    size: 25
                },
                position: "bottom",
                padding:{
                        top:30,
                        bottom:10,
                },    
            },
                legend: {
                    display: true,
                    labels: {
                        color: '#2c3e50',
                        font: {
                            size: 25,
                        },
                    },
                },
        },
        }
    });  
}

function total(totalconfirmed, totaldeaths,totalrecovered){
    counting(totalconfirmed,confirmed.children[1]);
    counting(totaldeaths,deaths.children[1]);
    counting(totalrecovered,recovered.children[1]);
}

function update(newconfirmed,newdeaths,newrecovered){
    counting(newconfirmed,confirmed.children[2]);
    counting(newdeaths,deaths.children[2]);
    counting(newrecovered,recovered.children[2]);
}

function resetvalue(data){
    data.children[1].innerHTML=0;
    data.children[2].innerHTML=0;
}


const btn1=document.querySelector('#btn1');
btn1.addEventListener('click',(ele)=>{
     ele.preventDefault();
     //console.log(search.value);
     //console.log(search.name);
     covidtrack(search.value);
});

const btn2=document.querySelector('#btn2');
btn2.addEventListener('click',(ele)=>{
     ele.preventDefault();
     console.log(searchindia.value);
     //console.log(searchindia.name);
     covidtrackindia(searchindia.value);
});
