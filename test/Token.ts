// shoulds: 
// - able to get balance of account
// - able to transfer token from account to a recipient
// - able to approve allowance for spender
// - able to transfer token form owner account to recipient by spender.
// - able to check allowance of spender.

import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import { network } from "hardhat";

describe("ERC20Token contract", async () => {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();

  let token: any;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async () => {
    [owner, addr1, addr2] = await viem.getWalletClients();

    token = await viem.deployContract("ERC20Token", ["BOR Token", "BOR", 18, 1000000n, ]);
  });

  it("should return token details", async () => {
    assert.equal(await token.read.name(), "BOR Token");
    assert.equal(await token.read.symbol(), "BOR");
    assert.equal(await token.read.decimals(), 18);
    assert.equal(await token.read.totalSupply(), 1000000n);
  });

  it("owner should have initial balance", async () => {
    const balance = await token.read.balanceOf([owner.account.address]);
    assert.equal(balance, 1000000n);
  });

  it("should transfer tokens from owner to addr1", async () => {
    const transferAmount = 100n;

    const ownerAddress = owner.account.address;
    const addr1Address = addr1.account.address;

    const ownerBalanceBefore = await token.read.balanceOf([ownerAddress]);
    const addr1BalanceBefore = await token.read.balanceOf([addr1Address]);

    await token.write.Transfer([addr1Address, transferAmount], {
        account: owner.account,
    });

    const ownerBalanceAfter = await token.read.balanceOf([ownerAddress]);
    const addr1BalanceAfter = await token.read.balanceOf([addr1Address]);

    assert.equal(ownerBalanceAfter, ownerBalanceBefore - transferAmount);
    assert.equal(addr1BalanceAfter, addr1BalanceBefore + transferAmount);
   });

   it("should approve allowance for addr1", async () => {
    const approvedAllowance = 300n;

    await token.write.approve([addr1.account.address, approvedAllowance], {
        account: owner.account,
    });

    const allowance = await token.read.allowance([addr1.account.address], {
        account: owner.account,
    });

    assert.equal(allowance, approvedAllowance);
   });

   it("transfer token form owner account to addr2 by addr1", async () => {
    const approvedAllowance = 300n;
    const amountSpent = 200n;

    const from = owner.account.address;
    const spender = addr1.account.address;
    const receiver = addr2.account.address;

    await token.write.approve([addr1.account.address, approvedAllowance], {
        account: owner.account,
    });

    const ownerBalanceBefore = await token.read.balanceOf([owner.account.address]);
    const receiverBalanceBefore = await token.read.balanceOf([receiver]);

    await token.write.transferFrom([from, receiver, amountSpent], {
        account: addr1.account,
    });

    const ownerBalanceAfter = await token.read.balanceOf([owner.account.address]);
    const receiverBalanceAfter = await token.read.balanceOf([receiver]);
    const allowanceAfter = await token.read.allowance([spender], {
        account: owner.account,
    });

    assert.equal(ownerBalanceAfter, ownerBalanceBefore - amountSpent);
    assert.equal(receiverBalanceAfter, receiverBalanceBefore + amountSpent);
    assert.equal(allowanceAfter, approvedAllowance - amountSpent);
   })
});
