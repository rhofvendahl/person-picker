import os

from constants import PATH_BASE


# Ensure images are ordered by angle
# (modifies inplace + returns, but whatever)
def place_image_path(image_paths, new_path, filename):
    place = int(filename[-6:-4]) - 1
    image_paths[place] = new_path
    return image_paths


def get_tpdne_people(path_base: str):
    people = []

    for folder_name, _, filenames in os.walk(os.path.join(path_base, "tpdne")):
        # Skip the topmost folder
        if folder_name == "tpdne":
            continue

        for filename in filenames:
            if ".jpg" not in filename:
                continue

            path_relative = os.path.join("tpdne", folder_name.split("/")[-1], filename)

            id = filename[:3]

            people.append(
                {
                    "id": id,
                    "imagePaths": [path_relative],
                }
            )

    return people


def get_tpdne_info():
    people = get_tpdne_people(PATH_BASE)

    return {
        "name": "tpdne",
        "fullName": "This Person Does Not Exist",
        "link": "thispersondoesnotexist.com",
        "termsOfUse": "I remember reading from the creator that anyone can use them for anything, incl commercial. Dunno where.",
        "collectionMethod": "TPDNE generates the images with ML, using images sourced from internet.",
        "consentStatement": "Unsure where the original images came from. Pretty sure creative commons or equivalent, i.e. aboveboard.",
        "citation": "This Person Does Not Exist, by Phillip Wang. Specific images from a Kaggle data dump of requested images.",
        "people": people,
    }
