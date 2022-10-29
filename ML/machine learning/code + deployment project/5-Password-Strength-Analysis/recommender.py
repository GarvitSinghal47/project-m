import string
import random


## characters to generate password from
alphabets = list(string.ascii_letters)
digits = list(string.digits)
special_characters = list("!@#$%^&*()")
characters = list(string.ascii_letters + string.digits + "!@#$%^&*()")


def generate_random_password( length,alphabets_count,digits_count,special_characters_count):
    
    characters_count = int(alphabets_count) + int(digits_count)+ int(special_characters_count)
    passwordlist = []
	## check the total length with characters sum count
	## print not valid if the sum is greater than length

    if characters_count > length:
        data = 0
        return data, passwordlist





	## initializing the password
    
   
    data=1
    for i in range(12):
        password = ''
        ## picking random alphabets
        for i in range(alphabets_count):
            password+=random.choice(alphabets)

        ## picking random digits
        for i in range(digits_count):
            password+=random.choice(digits)

        ## picking random alphabets
        for i in range(special_characters_count):
            password+=random.choice(special_characters)

        ## if the total characters count is less than the password length
        ## add random characters to make it equal to the length
        if characters_count < length:
            random.shuffle(characters)
            for i in range(length - characters_count):
                password+=random.choice(characters)

            ## shuffling the resultant password
            password1=''.join(sorted(password, key=lambda x: random.random()))
            
        passwordlist.append(password1)
    

    
    ## converting the list to string
    ## printing the list
    return data,passwordlist



