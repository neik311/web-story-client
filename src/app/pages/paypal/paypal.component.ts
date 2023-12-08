import { Router } from '@angular/router'
import { enumData } from '../../core/enumData'
import { Component, OnInit } from '@angular/core'
import { environment } from '../../../environments/environment'
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal'
import { User } from '../../models/user.model'
import { NotifyService, ApiService, AuthenticationService } from '../../services'
import { ACTION_DEPOSIT_SUCCESS, ERR_DEPOSIT_MONEY } from '../../core/constants'

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.scss'],
})
export class PaypalComponent implements OnInit {
  amount: any = null
  currency: string = 'USD'
  currentUser: User | undefined
  lstHistory: any[] = []
  lstChapter: any[] = []
  lstStory: any[] = []
  curStoryId: any =  null
  public payPalConfig?: IPayPalConfig

  constructor(private notifyService: NotifyService, private apiService: ApiService,private router: Router, private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue
    this.initConfig()
    this.loadData()
  }

  navigateToChapter(storyId: string, chapterId: string) {
    this.router.navigate([`read/${storyId}/${chapterId}`])
  }

  loadData() {
    this.apiService.post(this.apiService.WALLET.GET_LIST_HISTORY, {}).then((res: any) => {
      this.lstHistory = res
    })
    this.apiService.post(this.apiService.STORY.SELECT, {}).then((res: any) => {
      this.lstStory = res
    })
    this.apiService
      .post(this.apiService.WALLET.GET_LIST_CHAPTER, {
        where: {},
        skip: 0,
        take: enumData.Page.pageSizeMax,
      })
      .then((res: any) => {
        this.lstChapter = res[0]
        console.log(this.lstChapter)
      })
  }

  onChangeStory(){
    this.apiService
    .post(this.apiService.WALLET.GET_LIST_CHAPTER, {
      where: {storyId: this.curStoryId},
      skip: 0,
      take: enumData.Page.pageSizeMax,
    })
    .then((res: any) => {
      this.lstChapter = res[0]
    })
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: this.currency,
      clientId: environment.clientId,
      createOrderOnClient: (data) =>
        <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: this.currency,
                value: this.amount.toString(),
                breakdown: {
                  item_total: {
                    currency_code: this.currency,
                    value: this.amount.toString(),
                  },
                },
              },
            },
          ],
        },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions)
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details)
        })
      },
      onClientAuthorization: (data) => {
        this.apiService
          .post(this.apiService.WALLET.CREATE_WALLET, {
            type: enumData.WalletHistoryType.Deposit.code,
            amount: +this.amount,
            currency: this.currency,
            content: JSON.stringify(data),
          })
          .then(() => {
            if (this.currentUser) this.currentUser.amount = +this.currentUser.amount + +this.amount
            this.notifyService.showSuccess(ACTION_DEPOSIT_SUCCESS)
            this.apiService.post(this.apiService.WALLET.GET_LIST_HISTORY, {}).then((res: any) => {
              this.lstHistory = res
            })
          })
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data)
        // this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions)
      },
      onError: (err) => {
        console.log('OnError', err)
      },
      onClick: (data, actions) => {
        if(!this.amount || !+this.amount) this.notifyService.showError(ERR_DEPOSIT_MONEY)
        console.log('onClick', data, actions)
      },
    }
  }
}
