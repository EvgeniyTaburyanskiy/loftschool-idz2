# Loftshool **LOFTOGRAM**

<img src="http://www.windows-phone-user.de/var/ezdemo_site/storage/images/heftarchiv/2013/06/apps-fuer-windows-phones-von-samsung-und-htc/photogram-icon.png/38027-1-ger-DE/photogram-icon.png1_large.png" width="256" >

### Projects Links
* <img src="http://image.flaticon.com/icons/png/512/104/104111.png" width="24"> [TASK LIST](https://docs.google.com/spreadsheets/d/1fGqRRAGeujqcND2gL5ljCe2yVsB1Guc97A_XADirQ3I/edit#gid=0)
* <img src="http://image.flaticon.com/icons/svg/18/18454.svg" width="24">[Dev site]()
* <img src="http://image.flaticon.com/icons/svg/18/18454.svg" width="24">[Prod site]()

### Getting started:

```sh
mkdir idz2-loftogram
cd ./idz2-loftogram
git clone https://github.com/EvgeniyTaburyanskiy/loftschool-idz2.git .

npm install
gulp
```

###  Branch Naming Agreement
* _master_ - Для стабильных релизов которые можно публиковать на боевой сайт
* _dev_ - В эту ветку сливаем законченые таски
* _task/num_ - Ветка задач где: _num_ - Номер таска соответствует номеру из таск листа <img src="http://image.flaticon.com/icons/png/512/104/104111.png" width="24">[TASK LIST](https://docs.google.com/spreadsheets/d/1fGqRRAGeujqcND2gL5ljCe2yVsB1Guc97A_XADirQ3I/edit#gid=0)
    * делаем это так:
    ```sh
    git checkout  dev //-> Переходим в ветку Dev
    git checkout -b task/0  //-> Клонируем Dev в новую ветку и тутже переходим в эту ветку
    ```

    * в процессе делаем коммиты в новой ветке. Делаем Push таска.<br>
    ```sh
    git status  //-> Проверяем что мы в нужной ветке и что есть файлы которые еще не в отслеживании
    git add .   //-> Добавляем все файлы в отслеживание изменений
    git commit -m "Текст коммита" //-> Сохраняем локально все изменения с коментарием.
    git status   //-> Проверяем статус? удостоверяемся что все что нужно закоммитилось
    git push -u origin  task/0  //-> Пушим локальную копию ветки task/0 в глобальный репозиторий origin
    ```

    * закончив работу по таску сливаем с веткой Dev<br>
    ```sh  
    git checkout  dev //-> Переходим в ветку Dev
    git merge task/0  //-> Сливаем ветку task/0 с текущей активной веткой dev
    ```
            
        
### Team Members 
* <img src="https://github.com/favicon.ico" width="64">[Максим Орлов](http://github.com)
* <img src="https://avatars1.githubusercontent.com/u/19729612?v=3&s=460" width="64">[Дмитрий Гавриш](https://github.com/dmitrygavrish)
* <img src="https://avatars1.githubusercontent.com/u/7986099?v=3&s=460" width="64">[Дима Ганин](https://github.com/ganya555)
* <img src="https://avatars1.githubusercontent.com/u/7585251?v=3&s=460" width="64">[Евгений Табурянский](https://github.com/EvgeniyTaburyanskiy)
* <img src="https://avatars2.githubusercontent.com/u/16744815?v=3&s=460" width="64">[Олег Богданов](https://github.com/obogdanov)
