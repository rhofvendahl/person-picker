import os

from constants import PATH_BASE

DATASET_NAME = "muct"

# Lighting values
# (I actually think each set might have different lightings, but close enough)
# (start-end) soft lights both side, bright on one side, bright, dark
# (000-090) q,r,s,_
# (200-307) t,u,v,_
# (400-451) w,_,_,x
# (600-624) y,_,_,z

# Camera values
# a: front
# b: bit to the side
# c: farther to the side
# e: bit above
# d: bit below


# Ensure images are ordered by angle
# (modifies inplace + returns, but whatever)
def place_image_path(image_paths, new_path, folder_name):
    if "-a-" in folder_name:
        image_paths[0] = new_path
    elif "-b-" in folder_name:
        image_paths[1] = new_path
    elif "-c-" in folder_name:
        image_paths[2] = new_path
    return image_paths


def get_muct_people(path_base: str):
    people = []

    for folder_name, _, filenames in os.walk(os.path.join(path_base, "muct")):
        if "muct-" in folder_name:
            for filename in filenames:
                if ".jpg" not in filename:
                    continue

                good_lighting = (
                    "q" in filename
                    or "t" in filename
                    or "w" in filename
                    or "y" in filename
                )
                if not good_lighting:
                    continue

                path_relative = os.path.join(
                    "muct", folder_name.split("/")[-1], filename
                )

                id = filename[1:4]

                matches = [person for person in people if person["id"] == id]
                if len(matches) == 0:
                    if filename[-5:-4] == "f":
                        gender = "female"
                    else:
                        gender = "male"

                    people.append(
                        {
                            "id": id,
                            "datasetName": DATASET_NAME,
                            "imagePaths": place_image_path(
                                ["", "", ""], path_relative, folder_name
                            ),
                            "gender": gender,
                        }
                    )
                else:
                    matches[0]["imagePaths"] = place_image_path(
                        matches[0]["imagePaths"], path_relative, folder_name
                    )

    return people


def get_muct_info():
    people = get_muct_people(PATH_BASE)

    return {
        "name": "muct",
        "fullName": "MUCT Face Database",
        "link": "http://www.milbo.org/muct/",
        "termsOfUse": (
            "Please respect the privacy of the people who volunteered to have their "
            "faces photographed and DO NOT REPRODUCE the MUCT images in any "
            "publically available document (especially web pages)."
        ),
        "collectionMethod": (
            "The subjects in the database were sampled from people around "
            "the Leslie Social Sciences Building on the University Of Cape "
            "Town campus in December 2008. This diverse population "
            "included students, parents attending graduation ceremonies, "
            "high school teachers attending a conference, and employees of "
            "the university such as cleaners and security personnel. A wide "
            "range of subjects was photographed, with approximately equal "
            "numbers of males and females, and a cross section of ages and "
            "races. To recruit subjects, one of the researchers approached "
            "people asking if they would volunteer to be photographed, "
            "with the promise of a bar of chocolate as an inducement."
        ),
        "consentStatement": 'Participants volunteered, I\'m not sure of exact terms but see "terms of use".',
        "citation": (
            "S. Milborrow and J. Morkel and F. Nicolls (2010), "
            "The MUCT Landmarked Face Database, "
            "Pattern Recognition Association of South Africa"
        ),
        "people": people,
    }
