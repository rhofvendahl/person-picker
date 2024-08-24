import json
import os

import pandas as pd

PATH_BASE = "src/assets/datasets"

OUT_PATH = "scripts/out"
IN_PATH = "scripts/in"


def get_statistics(people):
    return {}


def add_demographics_chicago(people):
    cfd_all_df = (
        pd.read_csv(os.path.join(IN_PATH, "chicago/cfd-all.csv"))
        .fillna("")
        .replace("NA", "")
    )
    for person in people:
        match = cfd_all_df.loc[cfd_all_df["dataset_id"] == person["datasetId"]].iloc[0]
        if match["ethnicity"] != "":
            person["ethnicity"] = match["ethnicity"]
        if match["gender"] != "":
            person["gender"] = match["gender"]
        if match["age"] != "":
            person["age"] = match["age"]


def get_chicago_people(path_base: str):
    people = []

    cfd_relative = "chicago/CFD"
    for dataset_id in os.listdir(os.path.join(path_base, cfd_relative)):
        if not os.path.isdir(os.path.join(path_base, cfd_relative, dataset_id)):
            break

        for filename in os.listdir(os.path.join(path_base, cfd_relative, dataset_id)):
            # Stop at image
            if ".jpg" in filename:
                break

        path_relative = os.path.join(cfd_relative, dataset_id, filename)

        person_id = "__".join(path_relative.split("/"))[:-4]

        people.append(
            {
                "id": person_id,
                "datasetId": dataset_id,
                "images": [
                    {
                        "pathRelative": path_relative,
                    },
                ],
            }
        )

    add_demographics_chicago(people)

    return people


def get_chicago_info():
    people = get_chicago_people(PATH_BASE)

    statistics = get_statistics(people)

    return {
        "name": "chicago",
        "fullName": "Chicago Face Database",
        "termsOfUse": (
            "The database photographs and their accompanying information may be used "
            "free of charge for non-commercial scientific research purposes only."
        ),
        "collectionMethod": (
            "Individuals were recruited from the Chicago "
            "Research Laboratory of the University of Chicago Booth "
            "School of Business, located in downtown Chicago. Potential "
            "volunteers were contacted via email to serve as targets for the "
            "development of a database of faces to be used for research "
            "purposes. During the recruitment process we also targeted "
            "amateur actors and used snowball sampling in order to obtain "
            "a pool of individuals whom we believed would be able to "
            "produce reliable and believable facial expressions.\n[...]\n"
            "Sessions lasted approximately "
            "20 minutes and participants were compensated $20."
        ),
        "consentStatement": (
            "Upon arrival, participants were "
            "asked to carefully read a consent/release form, allowing us to "
            "use their photos for research purposes."
        ),
        "citation": (
            "Ma, D. S., Correll, J., & Wittenbrink, B. (2015). The Chicago Face "
            "Database: A free stimulus set of faces and norming data. Behavior "
            "Research Methods, 47(4), 1122-1135."
        ),
        "people": people,
        "statistics": statistics,
    }


def get_dataset_info():
    return [
        get_chicago_info(),
    ]


if __name__ == "__main__":
    info = get_dataset_info()

    if not os.path.exists(OUT_PATH):
        os.mkdir(OUT_PATH)

    with open(os.path.join(OUT_PATH, "dataset-info.json"), "w") as f:
        json.dump(info, f, indent=2)
