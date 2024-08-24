import os

from constants import PATH_BASE


# Ensure images are ordered by angle
# (modifies inplace + returns, but whatever)
def place_image_path(image_paths, new_path, filename):
    place = int(filename[-6:-4]) - 1
    image_paths[place] = new_path
    return image_paths


def get_london_people(path_base: str):
    people = []

    for folder_name, _, filenames in os.walk(os.path.join(path_base, "london")):
        # Skip the topmost folder
        if folder_name == "london":
            continue

        for filename in filenames:
            if ".jpg" not in filename:
                continue

            path_relative = os.path.join("london", folder_name.split("/")[-1], filename)

            id = filename[:3]

            matches = [person for person in people if person["id"] == id]
            if len(matches) == 0:
                people.append(
                    {
                        "id": id,
                        "imagePaths": place_image_path(
                            [""] * 10,
                            path_relative,
                            filename,
                        ),
                    }
                )
            else:
                matches[0]["imagePaths"] = place_image_path(
                    matches[0]["imagePaths"],
                    path_relative,
                    filename,
                )

    return people


def get_london_info():
    people = get_london_people(PATH_BASE)

    return {
        "name": "london",
        "fullName": "Face Research Lab London Set",
        "link": "https://figshare.com/articles/dataset/Face_Research_Lab_London_Set/5047666",
        "termsOfUse": (
            "Ok to use in lab-based and web-based studies in their original or ",
            "altered forms and to illustrate research (e.g., in scientific journals, "
            "news media or presentations). [from consent statement]",
        ),
        "collectionMethod": "Images were taken in London, UK, in April 2012.",
        "consentStatement": (
            'All individuals gave signed consent for their images to be "used in '
            "lab-based and web-based studies in their original or altered forms and "
            'to illustrate research (e.g., in scientific journals, news media or presentations)."'
        ),
        "citation": "DeBruine, Lisa; Jones, Benedict (2017). Face Research Lab London Set.",
        "people": people,
    }
