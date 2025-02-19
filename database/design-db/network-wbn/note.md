# provider
- create nw - pver1_inserttabp000 - networkdb
- nw detail - pver1_listoftabp000 - providerdb
- update nw - pver1_inserttabp000 - networkdb
- refresh invite code - cver1_shinvitabc200 - networkdb



# partner
- vào trang partner webinar
 + auto config - pver1_confirmivttabp100 - networkdb
 + load list - nwver1_listoftabb050und - providerdb

- join network - pver1_joinnwtabp100 - networkdb
- load contact - pver1_listoftabp100 - networkdb
- update contact - pver1_inserttabp100 - networkdb
- leave network - pver1_stornotabp100 - networkdb


# document
A. NETWORK
Các bảng cần đồng bộ network
- S200 : Video
- C400 : Landing page
- C450 : TYP
- M100 : Sender - không đồng bộ nhưng phải tạo ra theo thông tin underpartner
- B050 : Project
- M020 : Fake chat
- M620 : Poll
- M630 : Poll answer
- M650 : Media (theo Download & Button)
- M670 : Download
- B300 : Email template
- B400 : Button
- C100 : Show time
- N170 : Viewer fake
- K200 : Cookie banner


I. Network (P000):
`pver1_listoftabp000`
`pver1_inserttabp000` -> tự tạo Network lúc provider lần đầu truy cập menu Team Manager


+ Invitation code (c200):
`cver1_shinvitabc200` -> lưu ở p000.PV005


II. Network member (p100):
`pver1_listoftabp100`
`pver1_stornotabp100`
`pver1_joinnwtabp100`
`pver1_inserttabp100`


III. Đưa thay đổi của provider vào r200 qua hàm `rver1_inserttabr200net`
* check project provided throw network: `bver1_getnetworkstatu`


S200: `sver1_inserttabs200`
    `sver1_stornotabs200`
C400: `cver1_updatetabc400foo` => footer
    `cver1_updatetabc400for` => form
    `cver1_updatetabc400mod` => moderator
    `cver1_updatetabc400ter` => term
    `cver1_updatetabc400fbi` => update fb share image
C450: `cver1_updatetabc450comf` => confirm
    `cver1_updatetabc450comp => completed
M100: `mver1_inserttabm100`
--
B050: `bver1_inserttabb050`
    `bver1_updatetabb050doi`
    `bver1_updatetabb050chat`
    `bver1_stornotabb050`
--
N150: `nver1_inserttabn150`
M630: `mver1_inserttabm630`
M670: `mver1_inserttabm670`
    `mver1_stornotabm670`
M620: `mver1_inserttabm620`
    `mver1_stornotabm620`
M650: `mver1_inserttabm650`
    `mver1_stornotabm650`
M020: `mver1_inserttabm020`
    `mver1_stornotabm020`
B300: `bver1_inserttabb300`
    `bver1_stornotabb300`
B400: `bver1_inserttabb400`
    `bver1_stornotabb400`
C100: `cver1_inserttabc100`
    `cver1_removetabc100`
N170: `nver1_inserttabn170`
    `nver1_stornotabn170`
K200: `kver1_inserttabk200`


IV. Bật network cho project đang chạy
-- bật network cho 1 b050
`bver1_updatetabb050netw`
    -> `rver1_inserttabr200on`
    -> thu gom tất cả seting của b050 đưa vào r200 khi bật network
    `rver1_inserttabr200nw`


V. Đồng bộ thay đổi tới từng under partner kết hợp 2 hàm sau:
A. List project cho đã bật network của provider
`nwver1_listoftabwebinars`
B. Tất cả list setting tương ứng với FB050 của provider
* `rsha2020_listofwebitabs` trên network db


C. Các hàm insert xuống cho từng under partner
* các  function `*k` ở db provider cũ
S200: nwver1_inserttabs200
C400: nwver1_inserttabc400
C450:  nwver1_inserttabc450
M100:  nwver1_inserttabm100
--
B050: nwver1_inserttabb050
--
N150: nwver1_inserttabn150
M020: nwver1_inserttabm020
M620: nwver1_inserttabm620
M630: nwver1_inserttabm630
M650: nwver1_inserttabm650
M670: nwver1_inserttabm630
B300: nwver1_inserttabb300
    nwver1_stornotabb300
B400: nwver1_inserttabb400
    nwver1_removetabb400
C100: nwver1_inserttabc100
N170:  
K200: nwver1_inserttabk200



VI. Code web service luồn network