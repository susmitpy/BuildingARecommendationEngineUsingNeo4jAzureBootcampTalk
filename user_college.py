from typing import Optional

class HasNotDoneEngineeringException(Exception):
    pass

class User:
    __engineering_college: Optional[str] = None

    @property
    def engineering_college(self) -> str:
        if self.__engineering_college is None:
            raise HasNotDoneEngineeringException()
        return self.__engineering_college

    @engineering_college.setter
    def engineering_college(self, value: str) -> None:
        self.__engineering_college = value

if __name__ == "__main__":
    susmit = User()
    try:
        print (susmit.engineering_college)
    except HasNotDoneEngineeringException:
        print ("Bsc IT - DG Ruparel College")

