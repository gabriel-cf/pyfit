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
    response.forEach(exercise => {
        const data = {
            labels: getLabelsFromExercise(exercise),
            series: [getSeriesFromExercise(exercise)]
        }

        // TODO - Generate HTML elements instead
        document.getElementById(`chart${idx}`).innerHTML = exercise.exercise;
        new Chartist.Line(`.ct-chart${idx++}`, data);
    });
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
