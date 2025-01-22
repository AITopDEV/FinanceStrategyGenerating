import requests

from settings import Google_Map_Key


def get_house_picture(house_address, result_path):
    BASE_URL = "https://maps.googleapis.com/maps/api/streetview"
    # Adjust these parameters for multiple images
    headings = [0, 90, 180, 270]  # Compass directions: North, East, South, West
    pitches = [-10, 0, 10]  # Vertical angle of the camera
    size = "470x420"  # Image size: width x height
    filenames = []

    for i, heading in enumerate(headings):
        for j, pitch in enumerate(pitches):
            # Construct API query parameters
            params = {
                "size": size,
                "location": house_address,
                "heading": heading,  # Change direction
                "pitch": pitch,  # Keep the pitch fixed (straight view)
                "key": Google_Map_Key,
            }

            # Make the API request
            response = requests.get(BASE_URL, params=params)
            if response.status_code == 200:
                # Save image to the output folder
                file_name = (
                    result_path + f"/view_{i + 1}_heading_{heading}_pitch_{pitch}.jpg"
                )
                filenames.append(file_name)
                with open(file_name, "wb") as file:
                    file.write(response.content)
                print(f"Saved image: {file_name}")
            else:
                print(
                    f"Failed to fetch image for heading {heading} and pitch {pitch}. HTTP {response.status_code}"
                )

    return filenames


if __name__ == "__main__":
    address = "5 Marks St., Bendigo VIC 3550"
    result_files = get_house_picture(address, "")
