let id = 0;

const getLabelsFromExercise = (response) => {
    return response.training_sessions.map(session => new Date(session.date).toLocaleDateString("en-GB"));
};

const getSeriesFromExercise = (response) => {
    const findMaxWeight = (breakdown) => {
        if (breakdown.length === 0) { // no entries
            return 0
        }
        let maxWeight = breakdown[0][0];
        breakdown.forEach(breakdown => {
            if (breakdown[0] > maxWeight) {
                maxWeight = breakdown[0]
            }
        });
        return maxWeight

    }
    // [ [[80, 6], [85, 6], ... ]], [[], []] ]
    const breakdowns = response.training_sessions.map(session => session.breakdown);
    const maxWeightPerSession = breakdowns.map(breakdown => findMaxWeight(breakdown))
    return maxWeightPerSession;
};

const mapEntries = (response) => {
    let idx = 0;
    let chartHTML = '';
    response.forEach(exercise => {
        chartHTML += getChartHTML(exercise, idx++);
    });
    document.getElementsByClassName('chart-container')[0].innerHTML = chartHTML;
    idx = 0;
    response.forEach(exercise => {
        const data = {
            labels: getLabelsFromExercise(exercise),
            series: [getSeriesFromExercise(exercise)]
        }
        new Chartist.Line(`.ct-chart${idx++}`, data);
    });
};

const getChartHTML = (exercise, idx) => {
    return `
    <div>
        <h2>${exercise.exercise}</h2>
        <div style="max-width: 50%" class="ct-chart${idx} ct-major-twelfth"></div>
    </div>
    `
};

const Http = new XMLHttpRequest();
Http.responseType = 'json';
const url = 'http://localhost:5000/';
Http.open("GET", url);
Http.send();

Http.onreadystatechange = (e) => {
    if (Http.status === 200 && Http.response) {
        console.log(Http.response);
        mapEntries(Http.response);
    }
}
