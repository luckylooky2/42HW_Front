<div align="center">

# 42 Hello World

![html badge](https://img.shields.io/badge/-HTML-E34F26?style=flat-square&logo=HTML5&logoColor=white)
![css badge](https://img.shields.io/badge/-CSS-1572B6?style=flat-square&logo=CSS3&logoColor=white)
![TS badge](https://img.shields.io/badge/-Typescript-3178C6?style=flat-square&logo=Typescript&logoColor=white)

![react badge](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=React&logoColor=white)
![ContextAPI badge](https://img.shields.io/badge/-Context_API-61DAFB?style=flat-square&logo=React&logoColor=white)
![tailwindcss badge](https://img.shields.io/badge/tailwindcss-0F172A?style=flat-square&logo=tailwindcss&logoColor=white)
![socket.io badge](https://img.shields.io/badge/socket.io-black?style=flat-square&logo=socket.io&logoColor=white)
![WebRTC badge](https://img.shields.io/badge/WebRTC-white?style=flat-square&logo=WebRTC&logoColor=red)
![PWA badge](https://img.shields.io/badge/Progressive_Web_App-green?style=flat-square&logo=PWA&logoColor=white)

![issue](https://img.shields.io/github/issues/42HelloWorld/42HW_Front)
![issue](https://img.shields.io/github/issues-closed/42HelloWorld/42HW_Front)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/42HelloWorld/42HW_Front)

</div>

# 소개

<div align="center">
<img src="https://github.com/42HelloWorld/42HW_Front/assets/85822311/c33a529b-dfa7-4ea9-8bd2-4dce5c4af455?height=100" href="https://www.helloworld42.com/">
</div>
<br/>

<br/>

*42 Hello World*는 42서울의 영어 회화 동아리 HelloWorld에서 아이디어를 얻어 개발한 음성 통화 언어
교환 서비스입니다. 회화를 컨텐츠를 이용해 적극적인 참여를 이끌어낸 경험을 바탕으로 재미있는 컨텐츠를 제공하면 자연스럽고 즐겁게 언어를 배울 수 있을 것이라고 생각하여 프로젝트를 시작하게 되었습니다.

<br/>

# 페이지 및 기능

## 로그인

<div align="center">
<img src="https://github.com/42HelloWorld/42HW_Front/assets/85822311/710f1d56-45f4-4900-b945-73ab8aad8365" height="300"/>
</div>

<br/>

- 42 Intra OAuth를 이용하여 회원가입 및 로그인할 수 있습니다.(다른 로그인 방법은 추후 추가 예정)

## 홈 / 통화 선택 화면

<div align="center">
<img src="https://github.com/42HelloWorld/42HW_Front/assets/85822311/43bfb87a-fd2d-4fbe-9ebf-67ec09bce8d1" height="300"/>
</div>

<br/>

- 1:1 또는 그룹 통화 버튼을 클릭하여 통화를 시작할 수 있습니다.
- 가운데 프로필 사진을 클릭하여 설정 화면으로 이동할 수 있습니다.
- 상단의 알림 팝업(토스트)은 모바일 Google Chrome 환경에서 접속하는 경우 휴대폰 홈 화면에 바로가기를 추가할 수 있도록 합니다. iOS Safari에 경우, 해당 기능을 지원하지 않기 때문에 바로가기를 추가하는 방법을 안내합니다.

## 대기 화면

<div align="center">
<img src="https://github.com/42HelloWorld/42HW_Front/assets/85822311/32ce7e2b-7b2a-4f0c-8dae-071917b2ab8a" height="300"/>
</div>

<br/>

- 음성 통화를 위해 마이크 설정을 마치면, 대기 화면으로 이동할 수 있습니다.
- 대기 화면에서는 랜덤 매칭 방식으로 2 ~ 4명을 연결합니다.
- 매칭이 완료되면 알림 팝업을 통해 3초 후 통화가 시작됨을 알립니다.

## 통화 화면

<div align="center">
<img src="https://github.com/42HelloWorld/42HW_Front/assets/85822311/481d7d07-9701-4c68-b1f3-e20ba892597b" height="300"/>
</div>

<br/>

- 상단에 연결된 사용자 이름(들)과 통화 시간이 표시됩니다.
- 중단에는 컨텐츠가 표시되는 상자가 있습니다.
- 하단에는 토픽(대화 주제) 또는 게임 버튼을 클릭하여 상대방과 즐길 수 있는 컨텐츠를 선택할 수 있습니다.
- 마이크 음소거 버튼을 통해서 on/off 할 수 있습니다.
- 통화 종료 버튼을 클릭하여 홈 화면으로 되돌아갈 수 있습니다.

## 토픽 / 게임 투표 화면

<div align="center">
<img src="https://github.com/42HelloWorld/42HW_Front/assets/85822311/780fc6da-adce-4e16-86f0-b9219989abe0" height="300"/>
</div>

<br/>

- 한 사용자가 토픽 / 게임을 선택하면 모든 통화 참여자에게 투표 팝업이 나타납니다.
- 사용자들은 찬성 혹은 반대 버튼을 클릭하여 해당 토픽 / 게임을 할 것인지 투표합니다.
- 투표 종료 후 절반 이상의 찬성 표를 얻어 가결되는 경우, 모든 사용자에게 동일한 컨텐츠 화면이 보여지게 됩니다. 부결되는 경우는 아무 일도 발생하지 않으며 다시 시도할 수 있습니다.

## 설정 화면

<div align="center">
<img src="https://github.com/42HelloWorld/42HW_Front/assets/85822311/c3e81282-98fe-46d6-a207-a3e15e79c9df" height="300"/>
</div>

<br/>

- 프로필 사진, Intra ID, 소속 캠퍼스와 레벨이 표시됩니다.
- 말할 언어를 설정하여 같은 언어를 설정한 사용자끼리 매칭될 확률이 높일 수 있습니다.
- 시스템 언어를 한국어 또는 영어로 설정할 수 있습니다.
- 통화 내역에는 최근 통화 내역이 5개까지 표시됩니다.
