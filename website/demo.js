let id = 0;

const BREAKDOWN_WEIGHT_IDX = 0;
const BREAKDOWN_REPS_IDX = 1;
const SERIES_PER_SESSION = 3;

const getLabelsFromExercise = (response) => {
    return response.training_sessions.map(session => new Date(session.date).toLocaleDateString("en-GB"));
};

const getBreakdownPropertyByIdx = (breakdown, idx) => {
    if (!breakdown) {
        return 0;
    }
    return breakdown[idx] || 0;
};

const flatTrainingSessionsWithProperty = (response, propertyIndex) => {
    const listPerSeries = [[], [], []]
    response.training_sessions.forEach(session => {
        const sessionBreakdowns = session.breakdown.slice(0, SERIES_PER_SESSION);
        for (let series = 0; series < SERIES_PER_SESSION; series++) {
            listPerSeries[series].push(getBreakdownPropertyByIdx(sessionBreakdowns[series], propertyIndex));
        }
    });
    return listPerSeries;
};

const getWeightsPerRepFromExercise = (response) => {
    return flatTrainingSessionsWithProperty(response, BREAKDOWN_WEIGHT_IDX);
};

const getNumberOfRepsFromExercise = (response) => {
    return flatTrainingSessionsWithProperty(response, BREAKDOWN_REPS_IDX);
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
            series: getWeightsPerRepFromExercise(exercise)
        }
        new Chartist.Line(`#ct-chart-weight-per-rep${idx++}`, data, {
            plugins: [
                Chartist.plugins.ctPointLabels({
                    textAnchor: 'middle'
                })
            ]
        });
    });
    idx = 0;
    response.forEach(exercise => {
        const data = {
            labels: getLabelsFromExercise(exercise),
            series: getNumberOfRepsFromExercise(exercise),
        }
        new Chartist.Bar(`#ct-chart-number-of-reps${idx++}`, data, {
            axisY: {
                type: Chartist.AUTOSCALEAXIS,
                scaleMinSpace: 1,
                referenceValue: 6,
                onlyInteger: true,
            }
        });
    });
};

const getChartHTML = (exercise, idx) => {
    return `
    <div>
        <h2 style="text-align: center">${exercise.exercise}</h2>
        <h5>Weight per set</h5>
        <div class="ct-chart" id="ct-chart-weight-per-rep${idx}"></div>
        <h5>Repetitions per set</h5>
        <div class="ct-chart" id="ct-chart-number-of-reps${idx}"></div>
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
