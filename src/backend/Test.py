import math

def myFunction(x: float):
    return math.exp(x) - 3*x

x_lower = 0
x_upper = 1
x_mid = (x_lower + x_upper) / 2

while abs(myFunction(x_mid)) > 0.01:
    if myFunction(x_mid) * myFunction(x_lower) < 0:
        x_upper = x_mid
    else:
        x_lower = x_mid
    x_mid = (x_lower + x_upper) / 2

print(f"The root is approximately >>> {x_mid}")