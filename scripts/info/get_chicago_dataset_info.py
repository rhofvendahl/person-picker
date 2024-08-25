import os

import pandas as pd
from constants import IN_PATH, PATH_BASE


def add_demographics_chicago(people):
    cfd_all_df = (
        pd.read_csv(os.path.join(IN_PATH, "chicago/cfd-all.csv"))
        .fillna("")
        .replace("NA", "")
    )

    for person in people:
        # CFD-India IDs don't have the first "-"
        adjusted_id = person["id"]
        if person["id"][0] == "I":
            adjusted_id = person["id"][:2] + person["id"][3:]

        # I think "IM-719-220" in the sheet was a typo, should be "IM-719-221"
        if person["id"] == "IM-719-221":
            adjusted_id = "IM719-220"

        match = cfd_all_df.loc[cfd_all_df["id"] == adjusted_id].iloc[0]
        if match["ethnicity"] != "":
            person["ethnicity"] = match["ethnicity"]
        if match["gender"] != "":
            person["gender"] = match["gender"]
        if match["age"] != "":
            person["age"] = match["age"]


def get_chicago_people(path_base: str):
    people = []

    cfd_relative = "chicago/CFD"
    for id in os.listdir(os.path.join(path_base, cfd_relative)):
        if not os.path.isdir(os.path.join(path_base, cfd_relative, id)):
            continue

        for filename in os.listdir(os.path.join(path_base, cfd_relative, id)):
            # Stop at image
            if ".jpg" in filename:
                break

        path_relative = os.path.join(cfd_relative, id, filename)

        people.append(
            {
                "id": id,
                "imagePaths": [path_relative],
            }
        )

    cfd_india_relative = "chicago/CFD-INDIA"
    for filename_or_folder in os.listdir(os.path.join(path_base, cfd_india_relative)):
        # Some of these are actually folders with two files within them
        if os.path.isdir(
            os.path.join(path_base, cfd_india_relative, filename_or_folder)
        ):
            for filename in os.listdir(
                os.path.join(path_base, cfd_india_relative, filename_or_folder)
            ):
                # Stop at 1st image
                if "1-N.jpg" in filename:
                    path_relative = os.path.join(
                        cfd_india_relative, filename_or_folder, filename
                    )
                    break
        else:
            if ".jpg" in filename_or_folder:
                filename = filename_or_folder
                path_relative = os.path.join(cfd_india_relative, filename)

        # Cut off "CFD-" and "-N.jpg"
        id = filename[4:-6]

        people.append({"id": id, "imagePaths": [path_relative]})

    add_demographics_chicago(people)

    return people


def get_chicago_info():
    people = get_chicago_people(PATH_BASE)

    return {
        "name": "chicago",
        "fullName": "Chicago Face Database",
        "link": "https://www.chicagofaces.org/",
        "termsOfUse": (
            "(1) The database materials may be used for non-commercial scientific research purposes only.\n"
            "(2) The database materials shall not be published (in print, electronically, or in any other "
            "form) without written consent from the copyright holder, the University of Chicago, Center "
            "for Decision Research.\n"
            "(3) The database materials shall not be re-distributed to third parties, including, but not "
            "limited to, file hosting services or cloud-based AI image manipulation services.\n"
            "(4) No attempts may be made to identify or contact the individuals depicted in the database\n"
            "(including, but not limited to, the use of CFD photographs in facial recognition software).\n"
            "(5) Use of the database materials must be acknowledged in all published work."
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
    }
