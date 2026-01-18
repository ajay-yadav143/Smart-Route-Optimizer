class TrafficManager:
    traffic_multiplier = {
        "low": 1.0,
        "medium": 1.5,
        "high": 2.0
    }

    @staticmethod
    def apply_traffic(weight, traffic_level):
        return weight * TrafficManager.traffic_multiplier.get(traffic_level, 1.0)
