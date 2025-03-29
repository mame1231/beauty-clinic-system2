// グローバル変数
let patients = [];
let currentPatientId = null;

// ローカルストレージからデータを読み込む
function loadPatientsFromStorage() {
    const storedPatients = localStorage.getItem('beautyClinicPatients');
    if (storedPatients) {
        try {
            patients = JSON.parse(storedPatients);
        } catch (e) {
            console.error('LocalStorage data parsing error:', e);
            patients = generateDummyPatients();
        }
    } else {
        // ダミーデータの追加
        patients = generateDummyPatients();
        savePatientsToStorage();
    }
}

// ダミーデータを生成
function generateDummyPatients() {
    return [
        {
            id: "PT001",
            name: "山田 花子",
            birth: "1985-07-15",
            phone: "090-1234-5678",
            notes: "アレルギー：金属",
            treatments: [
                {
                    id: "TR00101",
                    date: "2025-03-01",
                    type: "ボトックス注射",
                    details: {
                        area: "額、眉間",
                        units: 20
                    },
                    notes: "初回施術。痛みに敏感。"
                },
                {
                    id: "TR00102",
                    date: "2025-03-20",
                    type: "ヒアルロン酸注入",
                    details: {
                        area: "ほうれい線",
                        product: "ジュビダームウルトラXC",
                        amount: "1ml"
                    },
                    notes: "腫れが少し気になるとのこと。次回は氷冷を長めに。"
                }
            ]
        },
        {
            id: "PT002",
            name: "佐藤 健太",
            birth: "1978-12-03",
            phone: "080-9876-5432",
            notes: "仕事の都合で土日のみ来院可能",
            treatments: [
                {
                    id: "TR00201",
                    date: "2025-02-10",
                    type: "レーザー治療",
                    details: {
                        machine: "フラクショナルCO2レーザー",
                        area: "顔全体",
                        intensity: "中"
                    },
                    notes: "男性肌向け設定で施術。次回は強度上げてもOKとのこと。"
                }
            ]
        },
        {
            id: "PT003",
            name: "鈴木 美香",
            birth: "1992-04-22",
            phone: "070-5555-7777",
            notes: "敏感肌。刺激の少ない製品を選ぶこと。",
            treatments: [
                {
                    id: "TR00301",
                    date: "2025-03-15",
                    type: "ケミカルピーリング",
                    details: {
                        type: "サリチル酸",
                        concentration: "20%",
                        application: "Tゾーン中心"
                    },
                    notes: "軽度の赤みあり、次回はさらに濃度を下げる。"
                },
                {
                    id: "TR00302",
                    date: "2025-03-25",
                    type: "フェイシャルエステ",
                    details: {
                        course: "ハイドレーティングコース",
                        time: "60分"
                    },
                    notes: "保湿重視のコースを選択。肌の状態が改善。"
                }
            ]
        }
    ];
}

// ローカルストレージにデータを保存
function savePatientsToStorage() {
    try {
        localStorage.setItem('beautyClinicPatients', JSON.stringify(patients));
    } catch (e) {
        console.error('LocalStorage save error:', e);
    }
}

// 日付をフォーマット
function formatDate(dateString) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/');
    } catch (e) {
        console.error('Date format error:', e);
        return dateString;
    }
}

// 施術タイプに応じたCSSクラスを取得
function getTreatmentClass(type) {
    switch (type) {
        case 'ボトックス注射': return 'bg-primary text-white';
        case 'ヒアルロン酸注入': return 'bg-info text-white';
        case 'レーザー治療': return 'bg-danger text-white';
        case 'ケミカルピーリング': return 'bg-warning';
        case '美容点滴': return 'bg-success text-white';
        case 'フェイシャルエステ': return 'bg-secondary text-white';
        default: return 'bg-dark text-white';
    }
}

// 患者一覧を表示
function displayPatients(filteredPatients = null) {
    console.log('Displaying patients...');
    const patientsToDisplay = filteredPatients || patients;
    const container = document.getElementById('patients-container');
    
    if (!container) {
        console.error('患者一覧コンテナが見つかりません');
        return;
    }
    
    container.innerHTML = '';

    if (patientsToDisplay.length === 0) {
        container.innerHTML = '<div class="col-12 text-center py-5"><p>該当する患者が見つかりません</p></div>';
        return;
    }

    patientsToDisplay.forEach(patient => {
        const lastTreatment = patient.treatments && patient.treatments.length > 0 
            ? patient.treatments[patient.treatments.length - 1] 
            : null;
        
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4 mb-4';
        card.innerHTML = `
            <div class="card shadow-sm h-100" data-patient-id="${patient.id}">
                <div class="card-body">
                    <h5 class="card-title">${patient.name} <small class="text-muted">#${patient.id}</small></h5>
                    <p class="card-text mb-1">
                        <small><i class="fas fa-phone me-2"></i>${patient.phone || '未登録'}</small>
                    </p>
                    <p class="card-text mb-2">
                        <small><i class="fas fa-calendar-alt me-2"></i>${formatDate(patient.birth) || '未登録'}</small>
                    </p>
                    ${lastTreatment ? `
                        <p class="card-text">
                            <span class="badge ${getTreatmentClass(lastTreatment.type)}">
                                ${lastTreatment.type}
                            </span>
                            <small class="text-muted ms-2">${formatDate(lastTreatment.date)}</small>
                        </p>
                    ` : '<p class="card-text"><small class="text-muted">施術履歴なし</small></p>'}
                </div>
                <div class="card-footer bg-transparent border-top-0 text-end">
                    <button class="btn btn-sm btn-outline-primary view-patient-btn">
                        <i class="fas fa-eye me-1"></i> 詳細
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(card);
        
        // 詳細ボタンにイベントリスナーを追加
        const viewBtn = card.querySelector('.view-patient-btn');
        if (viewBtn) {
            viewBtn.addEventListener('click', () => {
                openPatientModal(patient.id);
            });
        }
        
        // カード全体をクリックした時の処理
        const patientCard = card.querySelector('.card');
        if (patientCard) {
            patientCard.addEventListener('click', (e) => {
                if (!e.target.closest('.btn')) {
                    openPatientModal(patient.id);
                }
            });
        }
    });
}

// 患者詳細モーダルを開く
function openPatientModal(patientId) {
    currentPatientId = patientId;
    const patient = patients.find(p => p.id === patientId);
    
    if (!patient) return;
    
    // モーダルにデータをセット
    document.getElementById('patientModalLabel').textContent = `${patient.name} (#${patient.id})`;
    document.getElementById('modal-patient-name').textContent = patient.name;
    document.getElementById('modal-patient-id').textContent = patient.id;
    document.getElementById('modal-patient-birth').textContent = formatDate(patient.birth) || '未登録';
    document.getElementById('modal-patient-phone').textContent = patient.phone || '未登録';
    document.getElementById('modal-patient-notes').textContent = patient.notes || 'メモなし';
    
    // 施術リストを表示
    displayTreatments(patient);
    
    // モーダルを表示
    const patientModal = document.getElementById('patientModal');
    if (patientModal) {
        const modal = new bootstrap.Modal(patientModal);
        modal.show();
    }
}

// 施術履歴を表示
function displayTreatments(patient) {
    const treatmentsList = document.getElementById('treatments-list');
    if (!treatmentsList) return;
    
    treatmentsList.innerHTML = '';
    
    if (!patient.treatments || patient.treatments.length === 0) {
        treatmentsList.innerHTML = '<tr><td colspan="4" class="text-center py-3">施術履歴がありません</td></tr>';
        return;
    }
    
    // 日付の降順で並べ替え
    const sortedTreatments = [...patient.treatments].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedTreatments.forEach(treatment => {
        const tr = document.createElement('tr');
        
        let detailsText = '';
        if (treatment.details) {
            detailsText = Object.entries(treatment.details)
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ');
        }
        
        tr.innerHTML = `
            <td>${formatDate(treatment.date)}</td>
            <td><span class="badge ${getTreatmentClass(treatment.type)}">${treatment.type}</span></td>
            <td>${detailsText}</td>
            <td>
                <button class="btn btn-sm btn-outline-info view-treatment-btn" data-treatment-id="${treatment.id}" title="詳細">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger delete-treatment-btn ms-1" data-treatment-id="${treatment.id}" title="削除">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        treatmentsList.appendChild(tr);
        
        // 詳細ボタンのイベントリスナー
        const viewBtn = tr.querySelector('.view-treatment-btn');
        if (viewBtn) {
            viewBtn.addEventListener('click', () => {
                alert(`施術メモ: ${treatment.notes || 'メモなし'}`);
            });
        }
        
        // 削除ボタンのイベントリスナー
        const deleteBtn = tr.querySelector('.delete-treatment-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                if (confirm('この施術記録を削除してもよろしいですか？')) {
                    deleteTreatment(patient.id, treatment.id);
                }
            });
        }
    });
}

// 施術記録を削除
function deleteTreatment(patientId, treatmentId) {
    const patientIndex = patients.findIndex(p => p.id === patientId);
    
    if (patientIndex === -1) return;
    
    const treatmentIndex = patients[patientIndex].treatments.findIndex(t => t.id === treatmentId);
    
    if (treatmentIndex === -1) return;
    
    patients[patientIndex].treatments.splice(treatmentIndex, 1);
    savePatientsToStorage();
    
    // 患者詳細モーダルを更新
    displayTreatments(patients[patientIndex]);
    
    // 患者一覧も更新
    displayPatients();
}

// DOMが読み込まれたときの処理
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    
    try {
        // ローカルストレージからデータを読み込む
        loadPatientsFromStorage();
        
        // 患者一覧を表示
        displayPatients();
        
        // 患者検索機能の設定
        const searchInput = document.getElementById('patient-search');
        const searchButton = document.getElementById('search-button');
        
        if (searchInput && searchButton) {
            const performSearch = () => {
                const query = searchInput.value.trim().toLowerCase();
                
                if (query === '') {
                    displayPatients(); // 空の場合は全患者を表示
                    return;
                }
                
                const filteredPatients = patients.filter(patient => 
                    patient.name.toLowerCase().includes(query) ||
                    patient.id.toLowerCase().includes(query)
                );
                
                displayPatients(filteredPatients);
            };
            
            searchButton.addEventListener('click', performSearch);
            searchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });
        }
        
        // 患者登録フォームの設定
        const patientForm = document.getElementById('patient-form');
        if (patientForm) {
            patientForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const nameInput = document.getElementById('patient-name');
                const idInput = document.getElementById('patient-id');
                const birthInput = document.getElementById('patient-birth');
                const phoneInput = document.getElementById('patient-phone');
                const notesInput = document.getElementById('patient-notes');
                
                if (!nameInput || !idInput) return;
                
                // バリデーション
                if (!nameInput.value.trim() || !idInput.value.trim()) {
                    alert('名前と診察券番号は必須です');
                    return;
                }
                
                // ID の重複チェック
                if (patients.some(p => p.id === idInput.value.trim())) {
                    alert('この診察券番号は既に使用されています');
                    return;
                }
                
                // 新しい患者を追加
                const newPatient = {
                    id: idInput.value.trim(),
                    name: nameInput.value.trim(),
                    birth: birthInput ? birthInput.value : '',
                    phone: phoneInput ? phoneInput.value.trim() : '',
                    notes: notesInput ? notesInput.value.trim() : '',
                    treatments: []
                };
                
                patients.push(newPatient);
                savePatientsToStorage();
                
                // 患者一覧を更新
                displayPatients();
                
                // フォームをリセット
                patientForm.reset();
                
                // 患者一覧タブに切り替え
                const patientsTab = document.getElementById('patients-tab');
                if (patientsTab) {
                    bootstrap.Tab.getOrCreateInstance(patientsTab).show();
                }
                
                alert('患者を登録しました');
            });
        }
        
        // 施術追加ボタンのイベントリスナー
        const addTreatmentBtn = document.getElementById('add-treatment-btn');
        const treatmentFormCard = document.getElementById('treatment-form-card');
        const cancelTreatmentBtn = document.getElementById('cancel-treatment-btn');
        
        if (addTreatmentBtn && treatmentFormCard && cancelTreatmentBtn) {
            addTreatmentBtn.addEventListener('click', () => {
                treatmentFormCard.classList.remove('d-none');
                
                // 今日の日付をセット
                const treatmentDate = document.getElementById('treatment-date');
                if (treatmentDate) {
                    const today = new Date().toISOString().split('T')[0];
                    treatmentDate.value = today;
                }
            });
            
            cancelTreatmentBtn.addEventListener('click', () => {
                treatmentFormCard.classList.add('d-none');
                const treatmentForm = document.getElementById('treatment-form');
                if (treatmentForm) {
                    treatmentForm.reset();
                }
            });
        }
        
        // 施術タイプの変更イベント
        const treatmentType = document.getElementById('treatment-type');
        if (treatmentType) {
            treatmentType.addEventListener('change', () => {
                const detailsContainer = document.getElementById('treatment-details-container');
                if (!detailsContainer) return;
                
                const selectedType = treatmentType.value;
                
                if (!selectedType) {
                    detailsContainer.innerHTML = '';
                    return;
                }
                
                // 施術タイプに応じたフォームを表示（シンプル版）
                detailsContainer.innerHTML = `
                    <div class="mb-3">
                        <label for="treatment-details" class="form-label">詳細情報</label>
                        <textarea class="form-control" id="treatment-details" rows="2"></textarea>
                    </div>
                `;
            });
        }
        
        // 施術追加フォームの送信
        const treatmentForm = document.getElementById('treatment-form');
        if (treatmentForm) {
            treatmentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                if (!currentPatientId) return;
                
                const patientIndex = patients.findIndex(p => p.id === currentPatientId);
                if (patientIndex === -1) return;
                
                const dateInput = document.getElementById('treatment-date');
                const typeInput = document.getElementById('treatment-type');
                const detailsInput = document.getElementById('treatment-details');
                const notesInput = document.getElementById('treatment-notes');
                
                if (!dateInput || !typeInput) return;
                
                // バリデーション
                if (!dateInput.value || !typeInput.value) {
                    alert('施術日と施術タイプは必須です');
                    return;
                }
                
                // 新しい施術を追加
                const newTreatment = {
                    id: `TR${String(patients[patientIndex].id).substring(2)}${String(patients[patientIndex].treatments.length + 1).padStart(2, '0')}`,
                    date: dateInput.value,
                    type: typeInput.value,
                    details: { info: detailsInput ? detailsInput.value : '' },
                    notes: notesInput ? notesInput.value.trim() : ''
                };
                
                patients[patientIndex].treatments.push(newTreatment);
                savePatientsToStorage();
                
                // 施術リストを更新
                displayTreatments(patients[patientIndex]);
                
                // 患者一覧も更新
                displayPatients();
                
                // フォームをリセットして隠す
                treatmentForm.reset();
                if (treatmentFormCard) {
                    treatmentFormCard.classList.add('d-none');
                }
                
                // 詳細コンテナをクリア
                const detailsContainer = document.getElementById('treatment-details-container');
                if (detailsContainer) {
                    detailsContainer.innerHTML = '';
                }
            });
        }
        
        // 患者情報編集ボタン
        const editPatientBtn = document.getElementById('edit-patient-btn');
        if (editPatientBtn) {
            editPatientBtn.addEventListener('click', () => {
                if (!currentPatientId) return;
                
                const patient = patients.find(p => p.id === currentPatientId);
                if (!patient) return;
                
                // 編集モードはアラートでシンプルに実装
                const newName = prompt('患者名:', patient.name);
                if (newName === null) return;
                
                const newPhone = prompt('電話番号:', patient.phone);
                if (newPhone === null) return;
                
                const newNotes = prompt('メモ:', patient.notes);
                if (newNotes === null) return;
                
                // 患者情報を更新
                patient.name = newName.trim();
                patient.phone = newPhone.trim();
                patient.notes = newNotes.trim();
                
                savePatientsToStorage();
                
                // モーダルと患者リストを更新
                document.getElementById('patientModalLabel').textContent = `${patient.name} (#${patient.id})`;
                document.getElementById('modal-patient-name').textContent = patient.name;
                document.getElementById('modal-patient-phone').textContent = patient.phone || '未登録';
                document.getElementById('modal-patient-notes').textContent = patient.notes || 'メモなし';
                
                // 患者一覧も更新
                displayPatients();
            });
        }
    } catch (e) {
        console.error('アプリケーション初期化エラー:', e);
        alert('アプリケーションの初期化中にエラーが発生しました。ブラウザをリロードしてください。');
    }
});
