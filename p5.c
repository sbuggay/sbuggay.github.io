#include <stdio.h>
#include <stdbool.h>

int evendiv(int a, int b) {
	if ((float) a / (float) b == (a / b))
		return 1;
	return 0;
}

int main(int argc, char const *argv[]) {
	printf("p5\n");
	int i = 0;
	int number = 2050;
	bool found = false;

	do {
		found = true;
		for (i = 0; i < 20; i++) {
			printf("%d / %d\n", number, i);
			if (!evendiv(number, i))
				found = false;
		}
		number++;
	} while(!found);
	printf("%d\n", number - 1);

	return 0;
}