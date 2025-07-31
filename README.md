# Tidings Web Client

## 프로젝트

### [스텔라그램 Stellagram](https://stellagram.kr/)

## Tech

| <h3> Tool </h3> |      |
| --------------- | ---- |
| Npm             | Vite |

| <h3> Library </h3> |                 |         |              |         |
| ------------------ | --------------- | ------- | ------------ | ------- |
| React              | Tailwind CSS    | Zustand | React-router | i18next |
| fontawesome        | react-swipeable | immer   | Axios        | dayjs   |
| react-markdown     |                 |         |              |         |

---

## Development procedure

### Start procjet

<details>
<summary>detail</summary>
<div markdown="1">

#### install vite & Create react project

```bash
npm create vite@latest
```

```bash
√ Project name: ... tidings-web-client
√ Select a framework: » React
√ Select a variant: » TypeScript
```

#### Add react router package

```bash
npm install react-router-dom
```

#### Add zustand package

```bash
npm install zustand
```

#### Add tailwind package

```bash
npm install tailwindcss @tailwindcss/vite
```

```ts
// vite.config.ts
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()], //Add tailwindcss() plugin
});
```

#### Add reactI18n package

```bash
npm install i18next
```

#### Add react swipeable package

```bash
npm i react-swipeable
```

#### Add Immer package

```bash
npm install immer
```

#### Add Axios package

```bash
npm install axios
```

#### Add dotenv package

```bash
npm install dotenv
```

#### Add dayjs package

```bash
npm install dayjs
```

#### Add react markdown package

```bash
npm install react-markdown
```

</div>
</details>

### Theme

<details>
<summary>detail</summary>
<div markdown="1">

#### Add font family

```html
<!-- index.html -->
<link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
```

```css
/* index.css */
@import "tailwindcss";

@theme {
  --font-sans: InterVariable, sans-serif;
}
```

</div>
</details>

### Component

#### tailwindcss style from

- https://tailwindcss.com/docs/width

---

## Nginx를 통한 정적파일 서빙

### 디스크 스왑 메모리 할당

우선은 AWS에서 Nginx로 정적 파일 서빙을 목적으로 EC2 인스턴스를 하나 만들어줬고,

EC2 인스턴스를 생성할 때 만들었던 .pem 키의 권한을 400으로 변경한 뒤 .pem키를 이용하여

제 컴퓨터의 id_rsa_pub 키 값을 서버의 authorized_keys에 추가해줬습니다.

```bash
cat id_rsa.pub | ssh -i [.pem key 위치] ec2-user@[IP] 'mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys'
```

그 외에 비밀번호 접근 금지같은 설정은 EC2 인스턴스를 생성할 때 기본 설정으로 포함되어 있으니(Amazon 2023 AMI 기준), 리눅스 내부 추가적인 설정은 필요하지 않았습니다.

이후 SSH로 서버와 연결하여 디스크 스왑 메모리를 2GB로 설정해줬습니다.

가상 메모리 공간을 사용하려는 목적은 Nginx가 디스크 사용을 많이 필요로 하지 않는 것과 별개로, 세션 및 정적 데이터 캐싱 과정에서 OOM이 발생할 수 있어 안정성을 높여야 된다고 생각했기 때문이고,

2GB로 설정하는 이유는 현재 사용하는 EC2 t2.micro 모델의 메모리가 1GB이기 때문에 너무 많은 가상 공간을 할당하면 안정성과 별개로 너무 느려질 수 있기 때문입니다.

#### 디스크 스왑 메모리 할당

우선 디스크 스왑 메모리 설정 파일을 생성했습니다.

```bash
sudo dd if=/dev/zero of=/swapfile bs=128M count=16
```

- dd: 블록 단위로 파일을 복사하거나 파일 변환을 할 수 있는 명령어
- if: 지정한 파일을 입력 대상으로 설정
- of: 지정한 파일을 출력 대상으로 설정
- bs: 한 번에 변환 작업 가능한 바이트 크기
- count: 지정한 블록 수만큼 복사

이후 생성한 `/swapfile` 디렉토리를 대상으로 읽고 쓸 수 있도록 `600` 권한을 부여했고,

디스크 스왑 공간을 생성할 수 있도록 아래 명령어를 수행했습니다.

```bash
> sudo mkswap /swapfile

# 응답
Setting up swapspace version 1, size = 2 GiB (2147479552 bytes)
```

이후 생성한 스왑 공간을 스왑 메모리로 활용할 수 있도록 swapon을 해줬고,

```bash
sudo swapon /swapfile
```

`swapon`의 `-s` 옵션을 포함하여 정상적으로 스왑 메모리로 추가되었는지 확인할 수 있었습니다.

```bash
sudo swapon -s

#응답
Filename     Type     Size     Used     Priority
/swapfile    file     2097148  0        -2
```

그리고 재부팅 시 자동으로 스왑 메모리를 적용할 수 있도록 fstap에 추가해줬고,

```bash
echo /swapfile swap swap defaults 0 0 | sudo tee -a /etc/fstab
```

디스크 스왑 공간보다 메모리를 우선적으로 사용할 수 있도록 swappiness를 조절해주었습니다.

```bash
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
```

이제 `free` 명령어로 메모리를 확인하면?

```bash
> free

# 응답
	         total      used      free    shared  buff/cache   available
Mem:        972176    130432    186436      448      655308      693696
Swap:      2097148        0    2097148
```

성공적으로 디스크 스왑 메모리가 생긴 것을 확인할 수 있었습니다.

### Nginx 설치

보다 쉬운 Nginx 설치를 위해 Amazon 2023 AMI에서 제공하는 Nginx 레포지토리가 존재하는지 확인해야 했습니다.

```bash
> dnf list available nginx

# 응답
Available Packages
nginx.x86_64    1:1.28.0-1.amzn2023.0.1    amazonlinux
```

설치할 수 있는 Nginx가 있는 걸 확인했으니 dnf 패키지 매니저로 nginx를 설치해줬습니다.

```bash
sudo dnf install -y nginx

Installed:
   nginx-core-1:1.28.0-1.amzn2023.0.1.x86_64
   nginx-1:1.28.0-1.amzn2023.0.1.x86_64
   ...
```

이후 nginx 프로세스를 실행시켜줬고, 리눅스 재부팅 이후에도 자동으로 실행될 수 있도록 설정까지 해줬습니다.

```bash
sudo systemctl start nginx

sudo systemctl enable nginx
```

### TLS 설정

우선은 HTTPS를 이용하기 위해 인증서 기반 인증을 수행하려면 CA를 통해 인증을 수행해야하는데,
일반적인 CA 기관은 전부 인증에 비용이 발생하기 때문에, 어느 부호의 자비로 비용이 발생하지 않는 Let's Encrypt로 인증을 수행하고자 했습니다.

```bash
sudo dnf install certbot python3-certbot-nginx
```

따라서 인증을 수행할 수 있는 certbot 패키지를 설치해줬습니다. (만약 필요하다면 epel 사용)

인증서 발급에 앞서 인증서 생성 시에 자동으로 인증서 매칭을 수행할 수 있도록 Nginx 서버 설정을 먼저 해주면 편해서

Nginx 설정 파일을 `/etc/nginx/conf.d` 경로에 우리 도메인으로 추가해줬습니다.

```bash
# Nginx 설정 파일 생성 및 vi로 편집
sudo vi /etc/nginx/conf.d/stellagram.kr.conf
```

```conf
## /etc/nginx/conf.d/www.funch.site.conf
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    root /var/www/html;
    server_name stellagram.kr www.stellagram.kr;
}
```

인증서를 우리 루트 호스트 도메인과 `www` CNAME 도메인으로도 인증을 수행할 수 있도록 생성해줬습니다.

```bash
sudo certbot --nginx -d stellagram.kr -d www.stellagram.kr
```

아래는 certbot에 의해 인증 수행이 매커니즘이 nginx 설정에 자동 포함된 모습

```
## /etc/nginx/conf.d/stellagram.kr.conf
server {
        root /var/www/tidings-client/build;
        server_name stellagram.kr www.stellagram.kr;

    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/stellagram.kr/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/stellagram.kr/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}

server {
    if ($host = www.stellagram.kr) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    if ($host = stellagram.kr) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


        listen 80 default_server;
        listen [::]:80 default_server;
        server_name stellagram.kr www.stellagram.kr;
    return 404; # managed by Certbot
}
```

기본적으로 위 설정에 따르려고 하지만, Nginx의 기본 요청 사이즈가 1MB이기 때문에 이 부분만 5MB로 늘려줬습니다.

```conf
# server {
	client_max_body_size 5M;
# }
```

마지막으로 TLS 인증서를 지속적으로 갱신해줘야 하는데 수동으로 하면 번거롭기 때문에 crontab을 이용한 자동화를 수행해줬습니다.

```bash
vi /etc/crontab

0 12 * * * root /usr/bin/certbot renew --quiet --renew-hook "systemctl reload nginx"
```

#### API 프록시

또한 API 서버의 메모리 문제로 API 서버 인스턴스 내에서 Nginx와 Spring 애플리케이션을 같이 실행시키면 부담이 될 수 있다고 판단해

API 요청을 보낼 때 웹 서버를 리버스 프록시로 사용하기로 결정하여 프록시 설정도 Nginx에서 함께 해줬습니다.

```conf
server {
    listen 443 ssl;
    server_name api.stellagram.kr;

    client_max_body_size 5M;

    ssl_certificate /etc/letsencrypt/live/api.stellagram.kr/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/api.stellagram.kr/privkey.pem; # managed by Certbot

    location / {
        proxy_pass http://[서버 아이피];
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
```

#### Nginx 총 정리 본

```
server {
    root /var/www/tidings-client/build;
    server_name stellagram.kr www.stellagram.kr;

    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot

    ssl_certificate /etc/letsencrypt/live/stellagram.kr/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/stellagram.kr/privkey.pem; # managed by Certbot

    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot

    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

    client_max_body_size 5M;

    location / {
            try_files $uri /index.html;
    }
}

server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name stellagram.kr www.stellagram.kr api.stellagram.kr;

    client_max_body_size 5M;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name api.stellagram.kr;

    client_max_body_size 5M;

    ssl_certificate /etc/letsencrypt/live/api.stellagram.kr/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/api.stellagram.kr/privkey.pem; # managed by Certbot

    location / {
        proxy_pass http://3.39.230.166:3000;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 클라이언트 배포

#### Node.js 설치

npm으로 프로젝트를 빌드해주기 위해서 node.js를 설치해줬습니다.

```bash
sudo dnf install -y nodejs
```

#### Git 설치

우선 클라이언트를 github에서 받아올 수 있게 git을 설치해줬습니다.

```bash
sudo dnf install -y git
```

#### 배포 자동화

사실 Github Actions나 Big bucket, jenkins같은 CICD툴을 이용하는 것이 테스트 등 부가적인 목적에서 좋을 수 있으나,

우선은 간단하게 스크립트를 통한 자동화를 수행하려고 합니다.

```bash
cd /

sudo vi auto-deploy.sh
```

```sh
#!/bin/bash

REPO_PATH="/var/www/tidings-client"
REMOTE_URL="git@github.com:tidings-repositories/web_client.git"
BRANCH="main"

mkdir -p "$REPO_PATH" && cd "$REPO_PATH" || exit 1

if [ ! -d ".git" ]; then
          git init
fi

if ! git remote | grep -q "^origin$"; then
            git remote add origin "$REMOTE_URL"
fi


LAST_COMMIT_FILE=".last_commit_hash"

if [ ! -f "$LAST_COMMIT_FILE" ]; then
        git rev-parse HEAD > "$LAST_COMMIT_FILE"
fi

git fetch origin

if ! git branch --show-current | grep -q "$BRANCH"; then
          git checkout -B "$BRANCH"
fi
git branch --set-upstream-to=origin/$BRANCH $BRANCH 2>/dev/null

LATEST_REMOTE_HASH=$(git rev-parse origin/main)

LAST_KNOWN_HASH=$(cat "$LAST_COMMIT_FILE")

if [ "$LATEST_REMOTE_HASH" != "$LAST_KNOWN_HASH" ]; then
        git pull origin main

        if [ $? -eq 0 ]; then

		  cd app
          npm install
          npm run build

          echo "$LATEST_REMOTE_HASH" > "$LAST_COMMIT_FILE"
        else
          echo "error: Failed git pull"
        fi
else
        echo "info: No project changed"
fi
```

이후 실행 권한을 부여해주고, 10분 마다 실행될 수 있도록 자동화까지 수행했습니다.

```bash
sudo chmod +x /auto-deploy.sh
```

```bash
sudo vi /etc/crontab

*/10 * *  *  *  /auto-deploy.sh
```

Remote 주소를 SSH로 설정했기 때문에 서버에서 생성한 RSA 키를 Github에 등록하는 과정도 필요했습니다.

```
ssh-keygen -t rsa -b 4096 -C "delivalue100@gmail.com"

cat id_rsa.pub
```

이후 출력된 공개키를 저는 개인 레포지토리가 아니라 Organization을 생성하여 이번 프로젝트들을 관리하고 있기 때문에 각각의 레포지토리 Deploy keys에도 추가해줬습니다.

##### 하다보니 Permission denied 에러가..

Deploy key도 등록했고, 문제없음을 확인했는데 fetch가 안되는 문제가 있어서 확인하니 리눅스 디렉토리에 권한이 없어서 발생하는 문제였습니다.

```
sudo chown -R ec2-user:ec2-user /var/www/tidings-client
```
