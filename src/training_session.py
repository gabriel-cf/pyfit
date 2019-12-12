import re
import json
import datetime

LAST_POUNDS_DATE = datetime.datetime(2019, 8, 12)

MAX_REPETITIONS = 8
RE_MATCHER = re.compile(r'^[0-9]+\.?[0-9]{0,2}')


class TrainingSession(object):

    def __init__(self, card_comment):
        # Dates coming in this format: '2019-04-20T01:57:51.563Z'
        self.date = datetime.datetime.strptime(card_comment['date'], '%Y-%m-%dT%H:%M:%S.%fZ')
        self.breakdown = self._get_breakdown(card_comment['data']['text'])

    def _ensure_kg(self, weight):
        if self.date <= LAST_POUNDS_DATE:
            weight = round(weight / 2.2)
        
        return weight
    
    def _get_breakdown(self, comment_text):
        lines = comment_text.split("\n")
        series = []
        numbersInComment = []
        for line in lines:
            all_numbers = RE_MATCHER.findall(line)
            if len(all_numbers) == 0:
                continue

            number = float(all_numbers[0])
            numbersInComment.append(number)

        commentOnlyHasRepetitions = not (any(number > MAX_REPETITIONS for number in numbersInComment) \
            and any(number <= MAX_REPETITIONS for number in numbersInComment))
        
        if (commentOnlyHasRepetitions):
            for number in numbersInComment:
                series.append([0.0, number])
        else:
            lastWeight = None
            for number in numbersInComment:
                if number > MAX_REPETITIONS:
                    lastWeight = self._ensure_kg(number)
                else:
                    series.append([lastWeight, number])
        
        return series
    
    def get_json(self):
        return {
            'date': self.date,
            'breakdown': self.breakdown
        }