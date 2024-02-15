async function converter() {
    const selector = document.querySelector("#currencies");
    const currencyValue = selector.options[selector.selectedIndex].value;

    if(currencyValue !== "Seleccione moneda") {
        try {
        
            const res = await fetch(`https://mindicador.cl/api/${currencyValue}`);
            const data = await res.json();
        
            const resultado = document.querySelector(".result");
            const pesos = Number(document.querySelector("#clp").value);
        
            const currency = Number(data.serie[0].valor);
        
            const preConversion = (pesos / currency);
            const conversion = Number(preConversion.toFixed(2));
        
            switch (currencyValue) {
                case "dolar":
                    resultado.innerHTML = `Resultado: $ ` + conversion;
                    break;
                case "euro":
                    resultado.innerHTML = `Resultado: € ` + conversion;
                    break;
                case "bitcoin":
                    resultado.innerHTML = `Resultado: ₿ ` + conversion;
                    break;
                case "uf":
                    resultado.innerHTML = `Resultado: UF ` + conversion;
                    break;
                case "utm":
                    resultado.innerHTML = `Resultado: UTM ` + conversion;
                    break;
            }
            graphCurrency(currencyValue)
        }
    
        catch(error) {
            alert(error.message);
        }
    } else {
        alert("Debes seleccionar una moneda");
    }
}

let myChart;

async function graphCurrency(currencyValue) {

    try {
        const res = await fetch(`https://mindicador.cl/api/${currencyValue}`);
        const data = await res.json();

        const xValues = [];
        const yValues = [];
        for (let i=9; i>=0; i--) {
            xValues[i] = data.serie[i].fecha.substring(0,10);
            yValues[i] = data.serie[i].valor;
        }

        const plugin = {
            id: 'customCanvasBackgroundColor',
            beforeDraw: (chart, args, options) => {
              const {ctx} = chart;
              ctx.save();
              ctx.globalCompositeOperation = 'destination-over';
              ctx.fillStyle = options.color || '#99ffff';
              ctx.fillRect(0, 0, chart.width, chart.height);
              ctx.restore();
            }
          };

        if(myChart) {
            myChart.destroy();
        }
        
        myChart = new Chart("myChart", {
            type: "line",
            data: {
              labels: xValues.reverse(),
              datasets: [{
                label: "Últimos 10 valores registrados de " + currencyValue.toUpperCase(),
                backgroundColor: "black",
                borderColor: "red",
                data: yValues.reverse(),
                id: currencyValue
              }]
            },
            options: {
                plugins: {
                    customCanvasBackgroundColor: {
                        color: 'white',
                    },
                },
            },
            plugins: [plugin],
        });
        ;
    }

    catch(error){
        alert(error.message)
    }

}
