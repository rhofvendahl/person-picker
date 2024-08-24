# [
#   {
#     "name": "chicago",
#     "pathBase": "src/assets/datasets/chicago/",
#     "collectionMethod": "",
#     "consentStatement": "",
#     "citation": "",
#     "statistics": {
#       "nPeople": 1,
#       "nMale": 1,
#       "nCaucasian": 1,
#       "avgAge": 28,
#       "ageBoxPlot": [
#         28,
#         28,
#         28,
#         28,
#         28
#       ]
#     },
#     "people": [
#       {
#         "id": "01234567",
#         "datasetId": "012",
#         "gender": "male",
#         "ethnicity": "caucasian",
#         "age": 28,
#         "images": [
#           {
#             "pathRelative": "CFD/AF-200/CFD-AF-200-228-N.jpg"
#           }
#         ]
#       }
#     ]
#   }
# ]
import json
import os

PATH_BASE = "src/assets/datasets"

OUT_PATH = "scripts/out"


def get_statistics(people):
    return {}


def get_chicago_people(path_base: str):
    people = []

    cfd_relative = "chicago/CFD"
    for dataset_id in os.listdir(os.path.join(path_base, cfd_relative)):
        if not os.path.isdir(os.path.join(path_base, cfd_relative, dataset_id)):
            break

        demo_num = dataset_id.split("-")

        for filename in os.listdir(os.path.join(path_base, cfd_relative, dataset_id)):
            # Stop at image
            if ".jpg" in filename:
                break

        if demo_num[0][0] == "A":
            ethnicity = "asian"
        elif demo_num[0][0] == "B":
            ethnicity = "black"
        elif demo_num[0][0] == "L":
            ethnicity = "latino"
        elif demo_num[0][0] == "W":
            ethnicity = "white"
        else:
            raise Exception("Unable to get chicago people: unexpected ethnicity code")

        if demo_num[0][1] == "F":
            gender = "female"
        elif demo_num[0][1] == "M":
            gender = "male"
        else:
            raise Exception("Unable to get chicago people: unexpected gender code")

        path_relative = os.path.join(cfd_relative, dataset_id, filename)

        # Transformed path without ".jpg"
        person_id = "__".join(path_relative.split("/"))[:-4]

        people.append(
            {
                "id": person_id,
                "datasetId": dataset_id,
                "gender": gender,
                "ethnicity": ethnicity,
                "age": 0,
                "images": [
                    {
                        "pathRelative": path_relative,
                    },
                ],
            }
        )

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
