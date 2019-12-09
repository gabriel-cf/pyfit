import json
from training_session import TrainingSession

class Exercise(object):
    def __init__(self, card):
        self.name = card.name
        self.training_sessions = list(map(lambda comment: TrainingSession(comment), card.comments))

    def get_json(self):
        return {
            'exercise': self.name,
            'training_sessions': list(map(lambda training_session: training_session.get_json(), self.training_sessions))
        }