import random

lower_list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
upper_list = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X','Y', 'Z']

def get_random_message():
    message = ''

    for i in range(200):
        random_num = random.randint(0,25)
        coin_flip = random.randint(0, 1)

        if coin_flip == 0:
            message += (lower_list[random_num])

        else:
            message += (upper_list[random_num])

    return message