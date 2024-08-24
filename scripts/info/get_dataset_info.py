import json
import os

from constants import OUT_PATH
from get_chicago_dataset_info import get_chicago_info
from get_london_dataset_info import get_london_info
from get_muct_dataset_info import get_muct_info
from get_tpdne_dataset_info import get_tpdne_info

# def get_statistics(people):
#     return {}


def get_dataset_info():
    return [
        get_chicago_info(),
        get_muct_info(),
        get_london_info(),
        get_tpdne_info(),
    ]


if __name__ == "__main__":
    info = get_dataset_info()

    if not os.path.exists(OUT_PATH):
        os.mkdir(OUT_PATH)

    with open(os.path.join(OUT_PATH, "dataset-info.json"), "w") as f:
        json.dump(info, f, indent=2)
